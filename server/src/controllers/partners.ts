import { pick } from 'lodash'
import mongoose from 'mongoose'

import { IPartnerDocument } from '../models/Partner'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Partner = mongoose.model<IPartnerDocument>('Partner')
const Archive = mongoose.model('Archive')

const cleanPartner = (obj: any) =>
  pick(obj, [
    'annualReports',
    'images',
    'longDescription',
    'videoReports',
    'title',
    'featuredImages',
    'shortDescription',
    'slug',
  ])
const cleanPartnerWithId = (obj: any) =>
  pick(obj, [
    '_id',
    'annualReports',
    'images',
    'longDescription',
    'videoReports',
    'title',
    'featuredImages',
    'shortDescription',
    'slug',
  ])

export const createPartner: Controller = async (req, res) => {
  const partner = await new Partner(cleanPartner(req.body)).save()
  return res.status(201).json(partner)
}

export const getPartners: Controller = async (_, res) => {
  const partners = await Partner.find()
  return res.json(partners)
}

export const updatePartner: Controller = async (req, res) => {
  const { _id } = req.params
  const partner = await Partner.findByIdAndUpdate(_id, cleanPartner(req.body), {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (partner) {
    return res.status(200).json(cleanPartnerWithId(partner))
  }
  throw notFoundError
}

export const deletePartner: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedPartner = await Partner.findByIdAndDelete(_id)
  if (deletedPartner) {
    await new Archive({ ...cleanPartner(deletedPartner), type: 'partner' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
