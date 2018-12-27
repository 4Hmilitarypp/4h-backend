/* import { omit } from 'lodash'
import mongoose from 'mongoose'
import { ICurriculumResource } from '../sharedTypes'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const CurriculumResource = mongoose.model('CurriculumResource')
const Archive = mongoose.model('Archive')

const formatCurriculumResource = (dbCurriculumResource: any): ICurriculumResource => {
  const { _id, abbreviation, email, image, name, phoneNumber, region } = dbCurriculumResource
  const curriculumResourceId = _id.toString()
  return { abbreviation, email, image, curriculumResourceId, name, phoneNumber, region }
}

export const createCurriculumResource: Controller = async (req, res) => {
  const dirtyCurriculumResource = await new CurriculumResource(req.body).save()
  return res.status(201).json(formatCurriculumResource(dirtyCurriculumResource))
}

export const getCurriculumResources: Controller = async (req, res) => {
  const dirtyCurriculumResources = await CurriculumResource.find()
  const curriculumResources = dirtyCurriculumResources.map(formatCurriculumResource)
  return res.json(curriculumResources)
}

export const updateCurriculumResource: Controller = async (req, res) => {
  const { curriculumResourceId, ...updates } = req.body
  const dirtyCurriculumResource = await CurriculumResource.findOneAndUpdate({ _id: curriculumResourceId }, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (dirtyCurriculumResource) {
    return res.status(200).json(formatCurriculumResource(dirtyCurriculumResource))
  }
  throw notFoundError
}

export const deleteCurriculumResource: Controller = async (req, res) => {
  // const toDelete = await CurriculumResource.findById(req.params.id)

  const deletedCurriculumResource = await CurriculumResource.findByIdAndDelete(req.params.id)
  if (deletedCurriculumResource) {
    await new Archive(omit(formatCurriculumResource(deletedCurriculumResource), 'curriculumResourceId')).save()
    return res.status(204).send()
  }
  throw notFoundError
}
 */
