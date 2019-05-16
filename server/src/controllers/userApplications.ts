import { pick } from 'lodash'
import mongoose from 'mongoose'
import applicationCommentTemplate from '../emailTemplates/applicationComment'
import { IApplicationDocument } from '../models/Application'
import { IUserDocument } from '../models/User'
import { IUserApplicationDocument } from '../models/UserApplication'
import { IUserApplication } from '../sharedTypes'
import { Controller } from '../types'
import { createValidationError, emailError, forbiddenError, notFoundError } from '../utils/errors'
import transporter from '../utils/nodemailer'

type TCreateUserApplication = Pick<
  IUserApplication,
  'baseId' | 'createdBy' | 'updatedBy' | 'dueDate' | 'title' | 'userId' | 'userGroups'
>

const Application = mongoose.model<IApplicationDocument>('Application')
const UserApplication = mongoose.model<IUserApplicationDocument>('UserApplication')
const User = mongoose.model<IUserDocument>('User')
const Archive = mongoose.model('Archive')

const cleanUserApplication = (obj: any) => pick(obj, ['status', 'url'])
const cleanUserApplicationWithId = (obj: any) => pick(obj, ['_id', 'status', 'url'])

/**
 * Shows a user their applications. If a user has not seen a a base application before, it should be created for them.
 * All base applications should show up in a user's application section, but it must be the application unique to that user.
 * key will be userId and baseId
 */
export const getUserApplications: Controller = async (req, res) => {
  const baseApplications = await Application.find({ userGroups: { $in: req.user.permissions } })
  const userApplications = await UserApplication.find({ userId: req.user._id })

  const applicationsToCreate = baseApplications.reduce<TCreateUserApplication[]>((arr, baseApplication) => {
    if (!userApplications.find(app => baseApplication._id.equals(app.baseId))) {
      arr.push({
        baseId: baseApplication._id,
        createdBy: 'system',
        dueDate: baseApplication.dueDate,
        title: baseApplication.title,
        updatedBy: 'system',
        userGroups: baseApplication.userGroups,
        userId: req.user._id,
      })
    }
    return arr
  }, [])
  const createdApplications = await UserApplication.insertMany(applicationsToCreate)

  const returnApplications = [...userApplications, ...createdApplications].map(userApp => ({
    ...(userApp as any)._doc,
    baseApplicationUrl: (baseApplications.find(app => app._id.equals(userApp.baseId)) as any).url,
  }))

  return res.json(returnApplications)
}

export const getUserApplication: Controller = async (req, res) => {
  const userApplication = await UserApplication.find({ id: req.params.id })
  return res.json(userApplication)
}

export const getByUserId: Controller = async (req, res) => {
  const userApplications = await UserApplication.find({ userId: req.params.userId })
  return res.json(userApplications)
}

export const getByBaseId: Controller = async (req, res) => {
  const userApplications = await UserApplication.find({ baseId: req.params.baseId })
  return res.json(userApplications)
}

export const updateUserApplication: Controller = async (req, res) => {
  const { _id } = req.params
  if (req.body.status !== 'Submitted' || req.body.status !== 'Not Submitted') {
    if (!req.user.permissions.includes('admin')) throw forbiddenError
  }

  const oldUserApplication = await UserApplication.findById(_id)
  if (!oldUserApplication) throw notFoundError
  if (oldUserApplication.status === 'Submitted' && req.body.status === 'Submitted') {
    throw createValidationError('the status was already "Submitted"')
  }

  const userApplication = await UserApplication.findByIdAndUpdate(
    _id,
    { ...cleanUserApplication(req.body), updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (userApplication) return res.status(200).json(cleanUserApplicationWithId(userApplication))
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

const cleanComment = (obj: any) => pick(obj, ['text'])

export const createComment: Controller = async (req, res) => {
  const { userApplicationId } = req.params
  const updatedUserApplication = (await UserApplication.findByIdAndUpdate(
    userApplicationId,
    {
      $push: {
        comments: {
          ...cleanComment(req.body),
          createdBy: req.user.email,
          updatedBy: req.user.email,
          userId: req.user._id,
        },
      },
    },
    { context: 'query', new: true, runValidators: true }
  )) as any
  if (updatedUserApplication) {
    // will only return the last comment in the list. If they are ordered in the db this won't work and I'll need to find a way to get the actual created comment
    const comment = updatedUserApplication.comments[updatedUserApplication.comments.length - 1]
    if (updatedUserApplication.userId.toString() !== req.user._id) {
      const user = await User.findById(updatedUserApplication.userId).select('email')
      if (!user) throw notFoundError
      console.log(user)
      console.log(req.user)
      try {
        await transporter.sendMail({
          from: `"4-H Military Partnerships" <${process.env.EMAIL_USER}>`,
          html: applicationCommentTemplate(req.user.name, req.body.text.substr(0, 50)),
          subject: `Comment Made on Application ${updatedUserApplication.title}`,
          text: '',
          to: user.email,
        })
      } catch (err) {
        throw emailError(err)
      }
    }
    return res.status(201).json(comment)
  }
  throw notFoundError
}

export const getComments: Controller = async (req, res) => {
  const userApplications = await UserApplication.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.userApplicationId),
      },
    },
    {
      $lookup: {
        as: 'users',
        foreignField: '_id',
        from: 'users',
        localField: 'comments.userId',
      },
    },
    {
      $project: {
        'comments._id': 1,
        'comments.text': 1,
        'comments.userId': 1,
        'users._id': 1,
        'users.name': 1,
      },
    },
  ])
  if (userApplications) {
    const result = userApplications[0].comments.map((comment: any) => ({
      ...comment,
      userName: userApplications[0].users.find((user: any) => user._id.equals(comment.userId)).name,
    }))
    return res.json(result)
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

  const firstUserApplication = await UserApplication.findById(userApplicationId).select('comments')

  if (firstUserApplication) {
    const dbComment = findCommentById(_id, firstUserApplication.comments)
    if (dbComment.userId.toString() !== req.user._id) throw forbiddenError
    const userApplication = await UserApplication.findOneAndUpdate(
      { _id: userApplicationId, 'comments._id': _id },
      {
        $set: { 'comments.$': { ...cleanComment(req.body), _id, userId: dbComment.userId, updatedBy: req.user.email } },
      },
      { new: true }
    )
    if (userApplication) {
      const updatedComment = findCommentById(_id, userApplication.comments)
      return res.status(200).json(updatedComment)
    }
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
