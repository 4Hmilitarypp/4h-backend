import { omit } from 'lodash'

export const omitV = (obj: any) => omit(obj, '_doc.__v')

export const formatDb = (obj: any) => ({ ...obj._doc, _id: obj._doc._id.toString() })
