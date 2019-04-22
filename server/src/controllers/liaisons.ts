import { pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Liaison = mongoose.model('Liaison')
const Archive = mongoose.model('Archive')

const cleanLiaison = (obj: any) => pick(obj, ['abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])
const cleanLiaisonWithId = (obj: any) =>
  pick(obj, ['_id', 'abbreviation', 'email', 'image', 'name', 'phoneNumber', 'region'])

export const createLiaison: Controller = async (req, res) => {
  const liaison = await new Liaison({
    ...cleanLiaison(req.body),
    createdBy: req.user.email,
    updatedBy: req.user.email,
  }).save()
  return res.status(201).json(liaison)
}

export const getLiaisons: Controller = async (_, res) => {
  const liaisons = await Liaison.find()
  return res.json(liaisons)
}

export const updateLiaison: Controller = async (req, res) => {
  const { _id } = req.params
  const liaison = await Liaison.findByIdAndUpdate(
    _id,
    { ...cleanLiaison(req.body), updatedBy: req.user.email },
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
  const { _id } = req.params
  const deletedLiaison = await Liaison.findByIdAndDelete(_id)
  if (deletedLiaison) {
    await new Archive({ archivedBy: req.user.email, record: cleanLiaison(deletedLiaison), type: 'liaison' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
