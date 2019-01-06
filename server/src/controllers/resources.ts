import { pick } from 'lodash'
import mongoose from 'mongoose'
import { IResourceDocument } from '../models/Resource'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const cleanResource = (obj: any) => pick(obj, ['title', 'shortDescription', 'longDescription', 'featuredImage', 'slug'])
const cleanResourceWithLessons = (obj: any) =>
  pick(obj, ['lessons', 'title', 'shortDescription', 'longDescription', 'featuredImage', 'slug'])
const cleanResourceWithId = (obj: any) =>
  pick(obj, ['_id', 'title', 'shortDescription', 'longDescription', 'featuredImage', 'slug'])

const Resource = mongoose.model('Resource')
const Archive = mongoose.model('Archive')

export const createResource: Controller = async (req, res) => {
  const resource = await new Resource(cleanResource(req.body)).save()
  return res.status(201).json(cleanResourceWithId(resource))
}

export const getResources: Controller = async (req, res) => {
  const resources = await Resource.find()
    .select('-lessons')
    .sort('title')
  return res.json(resources)
}

export const getResource: Controller = async (req, res) => {
  const { _id } = req.params
  const resource = await Resource.findById(_id)
  if (resource) {
    return res.json(resource)
  }
  throw notFoundError
}
export const getResourceBySlug: Controller = async (req, res) => {
  const { slug } = req.params
  const resource = await Resource.findOne({ slug })
  if (resource) {
    return res.json(resource)
  }
  throw notFoundError
}

export const updateResource: Controller = async (req, res) => {
  const { _id } = req.params
  const resource = await Resource.findOneAndUpdate(
    { _id },
    { ...cleanResource(req.body) },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (resource) {
    return res.status(200).json(cleanResourceWithId(resource))
  }
  throw notFoundError
}

export const deleteResource: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedResource = await Resource.findByIdAndDelete(_id)
  if (deletedResource) {
    await new Archive({ ...cleanResourceWithLessons(deletedResource), type: 'resource' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

const cleanLesson = (obj: any) => pick(obj, ['title', 'links', 'category'])

export const createLesson: Controller = async (req, res) => {
  const { resourceId } = req.params
  const updatedResource = (await Resource.findByIdAndUpdate(
    resourceId,
    {
      $push: { lessons: cleanLesson(req.body) },
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
  const { resourceId, _id } = req.params
  const resource = (await Resource.findOneAndUpdate(
    { _id: resourceId, 'lessons._id': _id },
    {
      $set: { 'lessons.$': { ...cleanLesson(req.body), _id } },
    },
    { new: true }
  )) as IResourceDocument
  if (resource) {
    const updatedLesson = findLessonById(_id, resource.lessons)
    return res.status(200).json(updatedLesson)
  }
  throw notFoundError
}

export const deleteLesson: Controller = async (req, res) => {
  const { resourceId, _id } = req.params
  const updatedResource = (await Resource.findByIdAndUpdate(resourceId, {
    $pull: { lessons: { _id } },
  })) as IResourceDocument
  if (updatedResource) {
    const deletedLesson = findLessonById(_id, updatedResource.lessons)
    if (deletedLesson) {
      await new Archive({ ...cleanLesson(deletedLesson), type: 'lesson' }).save()
      return res.status(204).send()
    }
    throw notFoundError
  }
  throw notFoundError
}
