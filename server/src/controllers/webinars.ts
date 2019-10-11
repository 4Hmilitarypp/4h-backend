import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError, forbiddenError } from '../utils/errors'
import { IWebinarDocument } from '../models/Webinar'
import { IArchiveDocument } from '../models/Archive'

const Webinar = mongoose.model<IWebinarDocument>('Webinar')
const Archive = mongoose.model<IArchiveDocument>('Archive')

const cleanWebinar = (obj: any) => pick(obj, ['category', 'description', 'title', 'url'])
const cleanWebinarWithId = (obj: any) => pick(obj, ['_id', 'category', 'description', 'title', 'url'])

export const createWebinar: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const webinar = await new Webinar({
    ...cleanWebinar(req.body),
    createdBy: (req.user as any).email,
    updatedBy: (req.user as any).email,
  }).save()
  return res.status(201).json(webinar)
}

export const getWebinars: Controller = async (_, res) => {
  const webinars = await Webinar.find()
  return res.json(webinars)
}

export const updateWebinar: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const webinar = await Webinar.findByIdAndUpdate(
    _id,
    { ...cleanWebinar(req.body), updatedBy: (req.user as any).email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (webinar) {
    return res.status(200).json(cleanWebinarWithId(webinar))
  }
  throw notFoundError
}

export const deleteWebinar: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const deletedWebinar = await Webinar.findByIdAndDelete(_id)
  if (deletedWebinar) {
    await new Archive({
      archivedBy: (req.user as any).email,
      record: cleanWebinar(deletedWebinar),
      type: 'webinar',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
