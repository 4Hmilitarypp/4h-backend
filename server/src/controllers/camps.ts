import { pick } from 'lodash'
import mongoose from 'mongoose'
import { ICampDocument } from '../models/Camp'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Camp = mongoose.model<ICampDocument>('Camp')
const Archive = mongoose.model('Archive')

const cleanCamp = (obj: any) =>
  pick(obj, ['ageRange', 'city', 'contact', 'description', 'descriptionTitle', 'featuredImage', 'state', 'title'])
const cleanCampWithId = (obj: any) =>
  pick(obj, [
    '_id',
    'ageRange',
    'city',
    'contact',
    'description',
    'descriptionTitle',
    'featuredImage',
    'state',
    'title',
  ])

export const createCamp: Controller = async (req, res) => {
  const camp = await new Camp({ ...cleanCamp(req.body), createdBy: req.user.email, updatedBy: req.user.email }).save()
  return res.status(201).json(camp)
}

export const getCamps: Controller = async (_, res) => {
  const camps = await Camp.find()
  return res.json(camps)
}

export const updateCamp: Controller = async (req, res) => {
  const { _id } = req.params
  const camp = await Camp.findByIdAndUpdate(
    _id,
    { ...cleanCamp(req.body), featuredImage: req.body.featuredImage, updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (camp) {
    return res.status(200).json(cleanCampWithId(camp))
  }
  throw notFoundError
}

export const deleteCamp: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedCamp = await Camp.findByIdAndDelete(_id)
  if (deletedCamp) {
    await new Archive({ archivedBy: req.user.email, record: cleanCamp(deletedCamp), type: 'camp' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

const cleanCampDate = (obj: any) => pick(obj, ['beginDate', 'endDate'])

export const createCampDate: Controller = async (req, res) => {
  const { campId } = req.params
  const updatedCamp = (await Camp.findByIdAndUpdate(
    campId,
    {
      $push: { dates: { ...cleanCampDate(req.body), createdBy: req.user.email, updatedBy: req.user.email } },
    },
    { context: 'query', new: true, runValidators: true }
  )) as any
  if (updatedCamp) {
    // will only return the last date in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created date
    const date = updatedCamp.dates[updatedCamp.dates.length - 1]
    return res.status(201).json(date)
  }
  throw notFoundError
}

export const getCampDates: Controller = async (req, res) => {
  const resource = await Camp.findById(req.params.campId).select('dates')
  if (resource) {
    const { dates } = resource
    return res.json(dates.sort((a, b) => (a.beginDate > b.beginDate ? 1 : -1)))
  }
  throw notFoundError
}

const findCampDateById = (id: string, dates?: any) => {
  if (dates) {
    return dates.id(id)
  }
  return false
}

export const updateCampDate: Controller = async (req, res) => {
  const { campId, _id } = req.params
  const resource = await Camp.findOneAndUpdate(
    { _id: campId, 'dates._id': _id },
    {
      $set: { 'dates.$': { ...cleanCampDate(req.body), _id, updatedBy: req.user.email } },
    },
    { new: true }
  )
  if (resource) {
    const updatedCampDate = findCampDateById(_id, resource.dates)
    return res.status(200).json(updatedCampDate)
  }
  throw notFoundError
}

export const deleteCampDate: Controller = async (req, res) => {
  const { campId, _id } = req.params
  const updatedCamp = await Camp.findByIdAndUpdate(campId, {
    $pull: { dates: { _id } },
  })
  if (updatedCamp) {
    const deletedCampDate = findCampDateById(_id, updatedCamp.dates)
    if (deletedCampDate) {
      await new Archive({ archivedBy: req.user.email, record: cleanCampDate(deletedCampDate), type: 'campDate' }).save()
      return res.status(204).send()
    }
    throw notFoundError
  }
  throw notFoundError
}
