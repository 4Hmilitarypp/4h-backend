import { omit, pick } from 'lodash'
import mongoose from 'mongoose'
import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const PageInfo = mongoose.model('PageInfo')

const cleanPageInfo = (obj: any) => pick(obj, ['info', 'page'])

export const createPageInfo: Controller = async (req, res) => {
  const pageInfo = await new PageInfo({
    ...cleanPageInfo(req.body),
    createdBy: req.user.email,
    updatedBy: req.user.email,
  }).save()
  return res.status(201).json(pageInfo)
}

export const getPageInfo: Controller = async (req, res) => {
  const { page } = req.params
  const pageInfo = await PageInfo.findOne({ page })
  if (pageInfo) {
    return res.json((pageInfo as any).info)
  }
  throw notFoundError
}

export const updatePageInfo: Controller = async (req, res) => {
  const { page } = req.params
  const pageInfo = await PageInfo.findOneAndUpdate(
    page,
    { ...cleanPageInfo(omit(req.body, 'page')), updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (pageInfo) {
    return res.status(200).json(cleanPageInfo(pageInfo))
  }
  throw notFoundError
}
