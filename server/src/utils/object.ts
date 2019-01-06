import { omit } from 'lodash'

export const omitV = (obj: any) => omit(obj, '_doc.__v')

export const formatDb = (doc: any | null) => (doc ? { ...doc.toJSON(), _id: doc.toJSON()._id.toString() } : null)
