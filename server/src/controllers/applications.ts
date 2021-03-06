import { pick } from 'lodash'
import mongoose from 'mongoose'
import { IApplicationDocument } from '../models/Application'
// import { IUserApplicationDocument } from '../models/UserApplication';
import { Controller } from '../types'
import { notFoundError, forbiddenError } from '../utils/errors'
import { IArchiveDocument } from '../models/Archive'

const Application = mongoose.model<IApplicationDocument>('Application')
// const UserApplication = mongoose.model<IUserApplicationDocument>('UserApplication')
const Archive = mongoose.model<IArchiveDocument>('Archive')

const cleanApplication = (obj: any) => pick(obj, ['dueDate', 'title', 'url', 'userGroups'])
const cleanApplicationWithId = (obj: any) => pick(obj, ['_id', 'dueDate', 'title', 'url', 'userGroups'])

export const createApplication: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const application = await new Application({
    ...cleanApplication({ ...req.body, userGroups: ['admin', ...req.body.userGroups] }),
    createdBy: (req.user as any).email,
    updatedBy: (req.user as any).email,
  }).save()
  return res.status(201).json(application)
}

export const getApplications: Controller = async (_, res) => {
  const applications = await Application.find().select(['-createdBy', '-updatedBy', '-updatedDate', '-createdDate'])
  return res.json(applications)
}

export const getApplicationIds: Controller = async (_, res) => {
  const applications = await Application.find().select(['_id', 'title', 'dueDate'])
  return res.json(applications)
}

export const updateApplication: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const application = await Application.findByIdAndUpdate(
    _id,
    { ...cleanApplication(req.body), updatedBy: (req.user as any).email },
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
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const deletedApplication = await Application.findByIdAndDelete(_id)
  if (deletedApplication) {
    await new Archive({
      archivedBy: (req.user as any).email,
      record: cleanApplication(deletedApplication),
      type: 'application',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
