import { omit } from 'lodash'
import { Document } from 'mongoose'

export const omitV = (obj: any) => omit(obj, '_doc.__v')

export const formatDb = (doc: Document | null) => (doc ? { ...doc.toJSON(), _id: doc.toJSON()._id.toString() } : null)
