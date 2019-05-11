import { pick } from 'lodash'
import mongoose from 'mongoose'
import { IApplicationDocument } from '../models/Application'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Application = mongoose.model<IApplicationDocument>('Application')
const Archive = mongoose.model('Archive')

const cleanApplication = (obj: any) => pick(obj, ['dueDate', 'name', 'url', 'userGroups'])
const cleanApplicationWithId = (obj: any) => pick(obj, ['_id', 'dueDate', 'name', 'url', 'userGroups'])

export const createApplication: Controller = async (req, res) => {
  const application = await new Application({
    ...cleanApplication(req.body),
    createdBy: req.user.email,
    updatedBy: req.user.email,
  }).save()
  return res.status(201).json(application)
}

export const getApplications: Controller = async (_, res) => {
  const applications = await Application.find()
  return res.json(applications)
}

export const updateApplication: Controller = async (req, res) => {
  const { _id } = req.params
  const application = await Application.findByIdAndUpdate(
    _id,
    { ...cleanApplication(req.body), updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (application) {
    return res.status(200).json(cleanApplicationWithId(application))
  }
  throw notFoundError
}

export const deleteApplication: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedApplication = await Application.findByIdAndDelete(_id)
  if (deletedApplication) {
    await new Archive({
      archivedBy: req.user.email,
      record: cleanApplication(deletedApplication),
      type: 'application',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
