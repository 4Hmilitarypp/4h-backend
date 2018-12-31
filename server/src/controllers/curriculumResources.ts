import { omit } from 'lodash'
import mongoose from 'mongoose'
import { ICurriculumResourceDocument } from '../models/CurriculumResource'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const omitVAndLessons = (obj: any) => {
  const noV = omitV(obj)
  return omit(noV, '_doc.lessons')
}

const CurriculumResource = mongoose.model('CurriculumResource')
const Archive = mongoose.model('Archive')

export const createCurriculumResource: Controller = async (req, res) => {
  const { _id, ...newCurriculumResource } = req.body
  const curriculumResource = await new CurriculumResource(newCurriculumResource).save()
  return res.status(201).json(omitVAndLessons(curriculumResource))
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
  const { _id, lessons, ...updates } = req.body
  const curriculumResource = await CurriculumResource.findByIdAndUpdate(_id, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (curriculumResource) {
    return res.status(200).json(omitVAndLessons(curriculumResource))
  }
  throw notFoundError
}

export const deleteCurriculumResource: Controller = async (req, res) => {
  const dirtyDeletedCurriculumResource = await CurriculumResource.findByIdAndDelete(req.params.id)
  if (dirtyDeletedCurriculumResource) {
    // Need to create a new object because we get a strange stack error from mongoose otherwise
    const { _id, ...deletedCurriculumResource } = (dirtyDeletedCurriculumResource as any)._doc
    await new Archive({ ...deletedCurriculumResource, type: 'curriculumResource' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

// ! something is wrong with creating a lesson!
export const createLesson: Controller = async (req, res) => {
  const { resourceId } = req.params
  // @ts-ignore
  const { _id, ...newLesson } = req.body
  const updatedCurriculumResource = (await CurriculumResource.findByIdAndUpdate(
    resourceId,
    {
      $push: { lessons: newLesson },
    },
    { new: true }
  )) as any
  if (updatedCurriculumResource) {
    // will only return the last lesson in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created lesson
    const lesson = updatedCurriculumResource.lessons[updatedCurriculumResource.lessons.length - 1]
    return res.status(201).json(lesson)
  }
  throw notFoundError
}

export const getLessons: Controller = async (req, res) => {
  const curriculumResource = await CurriculumResource.findById(req.params.resourceId).select('-__v')
  if (curriculumResource) {
    const { lessons } = curriculumResource as ICurriculumResourceDocument
    return res.json(lessons)
  }
  throw notFoundError
}

const findLessonById = (id: string, lessons?: any) => {
  if (lessons) {
    return lessons.id(id)
  }
  return false
}

export const updateLesson: Controller = async (req, res) => {
  const updates = req.body
  const curriculumResource = (await CurriculumResource.findOneAndUpdate(
    { _id: req.params.resourceId, 'lessons._id': updates._id },
    {
      $set: { 'lessons.$': updates },
    },
    { new: true }
  )) as ICurriculumResourceDocument
  if (curriculumResource) {
    const updatedLesson = findLessonById(updates._id, curriculumResource.lessons)
    return res.status(200).json(updatedLesson)
  }
  throw notFoundError
}

export const deleteLesson: Controller = async (req, res) => {
  const { resourceId, id } = req.params
  const updatedCurriculumResource = (await CurriculumResource.findByIdAndUpdate(resourceId, {
    $pull: { lessons: { _id: id } },
  })) as ICurriculumResourceDocument
  if (updatedCurriculumResource) {
    const dirtyDeletedLesson = findLessonById(id, updatedCurriculumResource.lessons)
    if (dirtyDeletedLesson) {
      // Need to create a new object because we get a strange stack error from mongoose otherwise
      const { _id, ...deletedLesson } = (dirtyDeletedLesson as any)._doc
      await new Archive({ ...deletedLesson, type: 'lesson' }).save()
      return res.status(204).send()
    }
    throw notFoundError
  }
  throw notFoundError
}
