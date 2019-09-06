import mongoose from 'mongoose'
import { I4HDocument } from '../sharedTypes';

import uniqueValidator = require('mongoose-unique-validator')


export interface IPageInfoDocument extends I4HDocument { }

const pageInfoSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  info: Object,
  page: { type: String, unique: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

pageInfoSchema.pre('save', function (this: any, next) {
  this.updatedAt = Date.now()
  next()
})

pageInfoSchema.pre('findOneAndUpdate', function (this: any, next) {
  ; (this as any)._update.updatedAt = Date.now()
  next()
})

pageInfoSchema.plugin(uniqueValidator)

export default mongoose.model('PageInfo', pageInfoSchema, 'page-info')
