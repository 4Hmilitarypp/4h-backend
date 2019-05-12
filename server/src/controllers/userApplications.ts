import { pick } from 'lodash'
import mongoose from 'mongoose'
import { IUserApplicationDocument } from '../models/UserApplication'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const UserApplication = mongoose.model<IUserApplicationDocument>('UserApplication')
const Archive = mongoose.model('Archive')

const cleanUserApplication = (obj: any) =>
  pick(obj, ['abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])
const cleanUserApplicationWithId = (obj: any) =>
  pick(obj, ['_id', 'abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])

export const createUserApplication: Controller = async (req, res) => {
  const userApplication = await new UserApplication({
    ...cleanUserApplication(req.body),
    createdBy: req.user.email,
    updatedBy: req.user.email,
  }).save()
  return res.status(201).json(userApplication)
}

export const getUserApplications: Controller = async (_, res) => {
  const userApplications = await UserApplication.find()
  return res.json(userApplications)
}
export const getUserApplication: Controller = async (req, res) => {
  const userApplication = await UserApplication.find({ id: req.params.id })
  return res.json(userApplication)
}

export const updateUserApplication: Controller = async (req, res) => {
  const { _id } = req.params
  const userApplication = await UserApplication.findByIdAndUpdate(
    _id,
    { ...cleanUserApplication(req.body), updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (userApplication) {
    return res.status(200).json(cleanUserApplicationWithId(userApplication))
  }
  throw notFoundError
}

export const deleteUserApplication: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedUserApplication = await UserApplication.findByIdAndDelete(_id)
  if (deletedUserApplication) {
    await new Archive({
      archivedBy: req.user.email,
      record: cleanUserApplication(deletedUserApplication),
      type: 'userApplication',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

const cleanComment = (obj: any) => pick(obj, ['title', 'links', 'category'])

export const createComment: Controller = async (req, res) => {
  const { userApplicationId } = req.params
  const updatedUserApplication = (await UserApplication.findByIdAndUpdate(
    userApplicationId,
    {
      $push: { comments: { ...cleanComment(req.body), createdBy: req.user.email, updatedBy: req.user.email } },
    },
    { context: 'query', new: true, runValidators: true }
  )) as any
  if (updatedUserApplication) {
    // will only return the last comment in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created comment
    const comment = updatedUserApplication.comments[updatedUserApplication.comments.length - 1]
    return res.status(201).json(comment)
  }
  throw notFoundError
}

export const getComments: Controller = async (req, res) => {
  const userApplication = await UserApplication.findById(req.params.userApplicationId)
    .select('comments')
    .sort('comments.$.title')
  if (userApplication) {
    const { comments } = userApplication
    return res.json(comments)
  }
  throw notFoundError
}

const findCommentById = (id: string, comments?: any) => {
  if (comments) {
    return comments.id(id)
  }
  return false
}

export const updateComment: Controller = async (req, res) => {
  const { userApplicationId, _id } = req.params
  const userApplication = await UserApplication.findOneAndUpdate(
    { _id: userApplicationId, 'comments._id': _id },
    {
      $set: { 'comments.$': { ...cleanComment(req.body), _id, updatedBy: req.user.email } },
    },
    { new: true }
  )
  if (userApplication) {
    const updatedComment = findCommentById(_id, userApplication.comments)
    return res.status(200).json(updatedComment)
  }
  throw notFoundError
}

export const deleteComment: Controller = async (req, res) => {
  const { userApplicationId, _id } = req.params
  const updatedUserApplication = await UserApplication.findByIdAndUpdate(userApplicationId, {
    $pull: { comments: { _id } },
  })
  if (updatedUserApplication) {
    const deletedComment = findCommentById(_id, updatedUserApplication.comments)
    if (deletedComment) {
      await new Archive({ archivedBy: req.user.email, record: cleanComment(deletedComment), type: 'comment' }).save()
      return res.status(204).send()
    }
    throw notFoundError
  }
  throw notFoundError
}
