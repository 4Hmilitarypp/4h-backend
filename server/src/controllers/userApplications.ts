import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const UserApplication = mongoose.model('UserApplication')
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
