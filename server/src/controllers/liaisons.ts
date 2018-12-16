import { omit } from 'lodash'
import mongoose from 'mongoose'
import { ILiaison } from '../sharedTypes'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const Liaison = mongoose.model('Liaison')
const Archive = mongoose.model('Archive')

const formatLiaison = (dbLiaison: any): ILiaison => {
  const { _id, abbreviation, email, image, name, phoneNumber, region } = dbLiaison
  const liaisonId = _id.toString()
  return { abbreviation, email, image, liaisonId, name, phoneNumber, region }
}

export const createLiaison: Controller = async (req, res) => {
  const dirtyLiaison = await new Liaison(req.body).save()
  return res.status(201).json(formatLiaison(dirtyLiaison))
}

export const getLiaisons: Controller = async (req, res) => {
  const dirtyLiaisons = await Liaison.find()
  const liaisons = dirtyLiaisons.map(formatLiaison)
  return res.json(liaisons)
}

export const updateLiaison: Controller = async (req, res) => {
  const { liaisonId, ...updates } = req.body
  const dirtyLiaison = await Liaison.findOneAndUpdate({ _id: liaisonId }, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (dirtyLiaison) {
    return res.status(200).json(formatLiaison(dirtyLiaison))
  }
  throw notFoundError
}

export const deleteLiaison: Controller = async (req, res) => {
  // const toDelete = await Liaison.findById(req.params.id)

  const deletedLiaison = await Liaison.findByIdAndDelete(req.params.id)
  if (deletedLiaison) {
    await new Archive(omit(formatLiaison(deletedLiaison), 'liaisonId')).save()
    return res.status(204).send()
  }
  throw notFoundError
}
