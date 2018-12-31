import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const Webinar = mongoose.model('Webinar')
const Archive = mongoose.model('Archive')

export const createWebinar: Controller = async (req, res) => {
  const { _id, ...newWebinar } = req.body
  const webinar = await new Webinar(newWebinar).save()
  return res.status(201).json(omitV(webinar))
}

export const getWebinars: Controller = async (req, res) => {
  const webinars = await Webinar.find().select('-__v')
  return res.json(webinars)
}

export const updateWebinar: Controller = async (req, res) => {
  const { _id, ...updates } = req.body
  const webinar = await Webinar.findByIdAndUpdate(_id, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (webinar) {
    return res.status(200).json(omitV(webinar))
  }
  throw notFoundError
}

export const deleteWebinar: Controller = async (req, res) => {
  const dirtyDeletedWebinar = await Webinar.findByIdAndDelete(req.params.id)
  if (dirtyDeletedWebinar) {
    const { _id, ...deletedWebinar } = (dirtyDeletedWebinar as any)._doc
    await new Archive(deletedWebinar).save()
    return res.status(204).send()
  }
  throw notFoundError
}
