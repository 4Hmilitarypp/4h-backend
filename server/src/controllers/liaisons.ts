import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError, forbiddenError } from '../utils/errors'
import { ILiaisonDocument } from '../models/Liaison'
import { IArchiveDocument } from '../models/Archive'

const Liaison = mongoose.model<ILiaisonDocument>('Liaison')
const Archive = mongoose.model<IArchiveDocument>('Archive')

const cleanLiaison = (obj: any) => pick(obj, ['abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])
const cleanLiaisonWithId = (obj: any) =>
  pick(obj, ['_id', 'abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])

export const createLiaison: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const liaison = await new Liaison({
    ...cleanLiaison(req.body),
    createdBy: (req.user as any).email,
    updatedBy: (req.user as any).email,
  }).save()
  return res.status(201).json(liaison)
}

export const getLiaisons: Controller = async (_, res) => {
  const liaisons = await Liaison.find()
  return res.json(liaisons)
}

export const updateLiaison: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const liaison = await Liaison.findByIdAndUpdate(
    _id,
    { ...cleanLiaison(req.body), updatedBy: (req.user as any).email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (liaison) {
    return res.status(200).json(cleanLiaisonWithId(liaison))
  }
  throw notFoundError
}

export const deleteLiaison: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const { _id } = req.params
  const deletedLiaison = await Liaison.findByIdAndDelete(_id)
  if (deletedLiaison) {
    await new Archive({
      archivedBy: (req.user as any).email,
      record: cleanLiaison(deletedLiaison),
      type: 'liaison',
    }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
