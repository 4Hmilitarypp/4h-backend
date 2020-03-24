import { pick } from 'lodash'
import mongoose from 'mongoose'
import { S3 } from 'aws-sdk'

import { IPartnerDocument } from '../models/Partner'
import { Controller } from '../types'
import { notFoundError, forbiddenError } from '../utils/errors'
import { IArchiveDocument } from '../models/Archive'

const Partner = mongoose.model<IPartnerDocument>('Partner')
const Archive = mongoose.model<IArchiveDocument>('Archive')

const cleanPartner = (obj: any) =>
  pick(obj, ['featuredImage1', 'featuredImage2', 'longDescription', 'title', 'shortDescription', 'slug'])
const cleanPartnerWithId = (obj: any) =>
  pick(obj, [
    '_id',
    'featuredImage1',
    'featuredImage2',
    'longDescription',
    'title',
    'featuredImages',
    'shortDescription',
    'slug',
  ])

export const createPartner: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const partner = await new Partner({
    ...cleanPartnerWithId(req.body),
    createdBy: (req.user as any).email,
    updatedBy: (req.user as any).email,
  }).save()
  return res.status(201).json(partner)
}

export const getPartnerSections: Controller = async (_, res) => {
  const partners = await Partner.find(null, '_id title featuredImage1 featuredImage2 shortDescription slug', {
    sort: { title: 1 },
  })
  return res.json(partners)
}

export const getPartner: Controller = async (req, res) => {
  const partner = await Partner.findOne({ slug: req.params.slug.toLowerCase() })
  if (!partner) {
    throw notFoundError
  }
  return res.json(partner)
}

export const updatePartner: Controller = async (req, res) => {
  const { _id } = req.params
  const partner = await Partner.findByIdAndUpdate(
    _id,
    { ...cleanPartner(req.body), updatedBy: (req.user as any).email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (partner) {
    return res.status(200).json(cleanPartnerWithId(partner))
  }
  throw notFoundError
}

export const deletePartner: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const deletedPartner = await Partner.findByIdAndDelete(_id)
  if (deletedPartner) {
    await new Archive({
      archivedBy: (req.user as any).email,
      record: cleanPartner(deletedPartner),
      type: 'partner',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

const cleanReport = (obj: any) => pick(obj, ['image', 'title', 'url'])

export const createReport: Controller = async (req, res) => {
  const { partnerId } = req.params
  if (!req.user) throw forbiddenError
  const updatedPartner = (await Partner.findByIdAndUpdate(
    partnerId,
    {
      $push: {
        reports: {
          $each: [{ ...cleanReport(req.body), createdBy: (req.user as any).email, updatedBy: (req.user as any).email }],
          $sort: { title: 1 },
        },
      },
    },
    { context: 'query', new: true, runValidators: true }
  )) as any
  if (updatedPartner) {
    // will only return the last report in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created report
    const report = updatedPartner.reports[updatedPartner.reports.length - 1]
    return res.status(201).json(report)
  }
  throw notFoundError
}

export const getReports: Controller = async (req, res) => {
  const partner = await Partner.findById(req.params.partnerId)
    .select('reports')
    .sort('reports.$.title')
  if (partner) {
    const { reports } = partner
    return res.json(reports)
  }
  throw notFoundError
}

export const getS3Reports: Controller = async (_req, res) => {
  const s3 = new S3({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })
  const params = {
    Bucket: '4hmpp-dev',
    Key: 'reports/dod-usda/OSD-OMK-camp-corporate-report-2013.pdf',
  }
  try {
    const results = await s3.getObject(params).promise()
    return res
      .status(200)
      .header('Content-type', results.ContentType)
      .send(results.Body)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

const findReportById = (id: string, reports?: any) => {
  if (reports) {
    return reports.id(id)
  }
  return false
}

export const updateReport: Controller = async (req, res) => {
  const { partnerId, _id } = req.params
  if (!req.user) throw forbiddenError
  const partner = await Partner.findOneAndUpdate(
    { _id: partnerId, 'reports._id': _id },
    {
      $set: { 'reports.$': { ...cleanReport(req.body), _id, updatedBy: (req.user as any).email } },
    },
    { new: true }
  )
  if (partner) {
    const updatedReport = findReportById(_id, partner.reports)
    return res.status(200).json(updatedReport)
  }
  throw notFoundError
}

export const deleteReport: Controller = async (req, res) => {
  const { partnerId, _id } = req.params
  if (!req.user) throw forbiddenError
  const updatedPartner = await Partner.findByIdAndUpdate(partnerId, {
    $pull: { reports: { _id } },
  })
  if (updatedPartner) {
    const deletedReport = findReportById(_id, updatedPartner.reports)
    if (deletedReport) {
      await new Archive({
        archivedBy: (req.user as any).email,
        record: cleanReport(deletedReport),
        type: 'report',
      }).save()
      return res.status(204).send()
    }
    throw notFoundError
  }
  throw notFoundError
}
