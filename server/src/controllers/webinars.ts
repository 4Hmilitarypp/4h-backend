import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Webinar = mongoose.model('Webinar')
const Archive = mongoose.model('Archive')

const cleanWebinar = (obj: any) => pick(obj, ['category', 'description', 'title', 'url'])
const cleanWebinarWithId = (obj: any) => pick(obj, ['_id', 'category', 'description', 'title', 'url'])

export const createWebinar: Controller = async (req, res) => {
  const webinar = await new Webinar(cleanWebinar(req.body)).save()
  return res.status(201).json(webinar)
}

export const getWebinars: Controller = async (_, res) => {
  const webinars = await Webinar.find()
  return res.json(webinars)
}

export const updateWebinar: Controller = async (req, res) => {
  const { _id } = req.params
  const webinar = await Webinar.findByIdAndUpdate(_id, cleanWebinar(req.body), {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (webinar) {
    return res.status(200).json(cleanWebinarWithId(webinar))
  }
  throw notFoundError
}

export const deleteWebinar: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedWebinar = await Webinar.findByIdAndDelete(_id)
  if (deletedWebinar) {
    await new Archive({ ...cleanWebinar(deletedWebinar), type: 'webinar' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
