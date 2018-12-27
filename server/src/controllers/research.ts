import { omit } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const Research = mongoose.model('Research')
const Archive = mongoose.model('Archive')

export const createResearch: Controller = async (req, res) => {
  const research = await new Research(req.body).save()
  return res.status(201).json(omitV(research))
}

export const getResearch: Controller = async (req, res) => {
  const research = await Research.find().select('-__v')
  return res.json(research)
}

export const updateResearch: Controller = async (req, res) => {
  const { _id, ...updates } = req.body
  const research = await Research.findByIdAndUpdate(_id, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (research) {
    return res.status(200).json(omitV(research))
  }
  throw notFoundError
}

export const deleteResearch: Controller = async (req, res) => {
  // const toDelete = await Research.findById(req.params.id)

  const dirtyDeletedResearch = await Research.findByIdAndDelete(req.params.id)
  if (dirtyDeletedResearch) {
    const { _id, ...deletedResearch } = (dirtyDeletedResearch as any)._doc
    await new Archive(omit(deletedResearch)).save()
    return res.status(204).send()
  }
  throw notFoundError
}
