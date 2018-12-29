import mongoose from 'mongoose'
// import { ICurriculumResource } from '../sharedTypes'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const CurriculumResource = mongoose.model('CurriculumResource')
const Archive = mongoose.model('Archive')

export const createCurriculumResource: Controller = async (req, res) => {
  const curriculumResource = await new CurriculumResource(req.body).save()
  return res.status(201).json(omitV(curriculumResource))
}

export const getCurriculumResources: Controller = async (req, res) => {
  const curriculumResources = await CurriculumResource.find().select('-__v -lessons')
  return res.json(curriculumResources)
}

export const getCurriculumResource: Controller = async (req, res) => {
  const curriculumResource = await CurriculumResource.findById(req.params.id).select('-__v')
  return res.json(curriculumResource)
}

export const updateCurriculumResource: Controller = async (req, res) => {
  const { _id, ...updates } = req.body
  const curriculumResource = await CurriculumResource.findByIdAndUpdate(_id, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (curriculumResource) {
    return res.status(200).json(omitV(curriculumResource))
  }
  throw notFoundError
}

export const deleteCurriculumResource: Controller = async (req, res) => {
  const dirtyDeletedCurriculumResource = await CurriculumResource.findByIdAndDelete(req.params.id)
  if (dirtyDeletedCurriculumResource) {
    // Need to create a new object because we get a strange stack error from mongoose otherwise
    const { _id, ...deletedCurriculumResource } = (dirtyDeletedCurriculumResource as any)._doc
    await new Archive(deletedCurriculumResource).save()
    return res.status(204).send()
  }
  throw notFoundError
}
