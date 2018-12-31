import mongoose from 'mongoose'
// import { ILiaison } from '../sharedTypes'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'
import { omitV } from '../utils/object'

const Liaison = mongoose.model('Liaison')
const Archive = mongoose.model('Archive')

export const createLiaison: Controller = async (req, res) => {
  const { _id, ...newLiaison } = req.body
  const liaison = await new Liaison(newLiaison).save()
  return res.status(201).json(omitV(liaison))
}

export const getLiaisons: Controller = async (req, res) => {
  const liaisons = await Liaison.find().select('-__v')
  return res.json(liaisons)
}

export const updateLiaison: Controller = async (req, res) => {
  const { _id, ...updates } = req.body
  const liaison = await Liaison.findByIdAndUpdate(_id, updates, {
    context: 'query',
    new: true,
    runValidators: true,
  })
  if (liaison) {
    return res.status(200).json(omitV(liaison))
  }
  throw notFoundError
}

export const deleteLiaison: Controller = async (req, res) => {
  const dirtyDeletedLiaison = await Liaison.findByIdAndDelete(req.params.id)
  if (dirtyDeletedLiaison) {
    // Need to create a new object because we get a strange stack error from mongoose otherwise
    const { _id, ...deletedLiaison } = (dirtyDeletedLiaison as any)._doc
    await new Archive({ ...deletedLiaison, type: 'liaison' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}
