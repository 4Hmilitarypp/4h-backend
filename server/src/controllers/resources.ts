import { omit } from 'lodash'
import mongoose from 'mongoose'
import { IResourceDocument } from '../models/Resource'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const omitVAndLessons = (obj: any) => {
  const noV = omitV(obj)
  return omit(noV, '_doc.lessons')
}

const Resource = mongoose.model('Resource')
const Archive = mongoose.model('Archive')

export const createResource: Controller = async (req, res) => {
  const { _id, ...newResource } = req.body
  const resource = await new Resource(newResource).save()
  return res.status(201).json(omitVAndLessons(resource))
}

export const getResources: Controller = async (req, res) => {
  const resources = await Resource.find()
    .select('-__v -lessons')
    .sort('title')
  return res.json(resources)
}

export const getResource: Controller = async (req, res) => {
  const resource = await Resource.findById(req.params.id).select('-__v')
  if (resource) {
    return res.json(resource)
  }
  throw notFoundError
}
export const getResourceBySlug: Controller = async (req, res) => {
  const resource = await Resource.findOne({ slug: req.params.slug }).select('-__v')
  if (resource) {
    return res.json(resource)
  }
  throw notFoundError
}

export const updateResource: Controller = async (req, res) => {
  // @ts-ignore
  const { _id, lessons, slug, description, title, featuredImage } = req.body
  const resource = await Resource.findOneAndUpdate(
    { _id },
    { description, title, featuredImage },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (resource) {
    return res.status(200).json(omitVAndLessons(resource))
  }
  throw notFoundError
}

export const deleteResource: Controller = async (req, res) => {
  const dirtyDeletedResource = await Resource.findByIdAndDelete(req.params.id)
  if (dirtyDeletedResource) {
    // Need to create a new object because we get a strange stack error from mongoose otherwise
    const { _id, ...deletedResource } = (dirtyDeletedResource as any)._doc
    await new Archive({ ...deletedResource, type: 'resource' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

export const createLesson: Controller = async (req, res) => {
  const { resourceId } = req.params
  // @ts-ignore
  const { _id, ...newLesson } = req.body
  const updatedResource = (await Resource.findByIdAndUpdate(
    resourceId,
    {
      $push: { lessons: newLesson },
    },
    { context: 'query', new: true, runValidators: true }
  )) as any
  if (updatedResource) {
    // will only return the last lesson in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created lesson
    const lesson = updatedResource.lessons[updatedResource.lessons.length - 1]
    return res.status(201).json(lesson)
  }
  throw notFoundError
}

export const getLessons: Controller = async (req, res) => {
  const resource = await Resource.findById(req.params.resourceId)
    .select('lessons')
    .sort('lessons.$.title')
  if (resource) {
    const { lessons } = resource as IResourceDocument
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
  const resource = (await Resource.findOneAndUpdate(
    { _id: req.params.resourceId, 'lessons._id': updates._id },
    {
      $set: { 'lessons.$': updates },
    },
    { new: true }
  )) as IResourceDocument
  if (resource) {
    const updatedLesson = findLessonById(updates._id, resource.lessons)
    return res.status(200).json(updatedLesson)
  }
  throw notFoundError
}

export const deleteLesson: Controller = async (req, res) => {
  const { resourceId, id } = req.params
  const updatedResource = (await Resource.findByIdAndUpdate(resourceId, {
    $pull: { lessons: { _id: id } },
  })) as IResourceDocument
  if (updatedResource) {
    const dirtyDeletedLesson = findLessonById(id, updatedResource.lessons)
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
