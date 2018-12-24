import { omit } from 'lodash'
import mongoose from 'mongoose'
import { IResearch } from '../sharedTypes'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Research = mongoose.model('Research')
const Archive = mongoose.model('Archive')

const formatResearch = (dbResearch: any): IResearch => {
  const { _id, description, title, type, url } = dbResearch
  const researchId = _id.toString()
  return { description, researchId, title, type, url }
}

export const createResearch: Controller = async (req, res) => {
  const dirtyResearch = await new Research(req.body).save()
  return res.status(201).json(formatResearch(dirtyResearch))
}

export const getResearch: Controller = async (req, res) => {
  const dirtyResearch = await Research.find()
  const research = dirtyResearch.map(formatResearch)
  return res.json(research)
}

export const updateResearch: Controller = async (req, res) => {
  const { researchId, ...updates } = req.body
  const dirtyResearch = await Research.findOneAndUpdate({ _id: researchId }, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (dirtyResearch) {
    return res.status(200).json(formatResearch(dirtyResearch))
  }
  throw notFoundError
}

export const deleteResearch: Controller = async (req, res) => {
  // const toDelete = await Research.findById(req.params.id)

  const deletedResearch = await Research.findByIdAndDelete(req.params.id)
  if (deletedResearch) {
    await new Archive(omit(formatResearch(deletedResearch), 'researchId')).save()
    return res.status(204).send()
  }
  throw notFoundError
}
