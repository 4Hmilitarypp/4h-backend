import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Research = mongoose.model('Research')
const Archive = mongoose.model('Archive')

const cleanResearch = (obj: any) => pick(obj, ['description', 'title', 'type', 'url'])
const cleanResearchWithId = (obj: any) => pick(obj, ['_id', 'description', 'title', 'type', 'url'])

export const createResearch: Controller = async (req, res) => {
  const research = await new Research(cleanResearch(req.body)).save()
  return res.status(201).json(research)
}

export const getResearch: Controller = async (req, res) => {
  const research = await Research.find()
  return res.json(research)
}

export const updateResearch: Controller = async (req, res) => {
  const { _id } = req.params
  const research = await Research.findByIdAndUpdate(_id, cleanResearch(req.body), {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (research) {
    return res.status(200).json(cleanResearchWithId(research))
  }
  throw notFoundError
}

export const deleteResearch: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedResearch = await Research.findByIdAndDelete(_id)
  if (deletedResearch) {
    await new Archive({ ...cleanResearch(deletedResearch), type: 'research' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
