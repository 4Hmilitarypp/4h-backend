import mongoose from 'mongoose'
import { IWebinar, Omit, I4HDocument } from '../sharedTypes'

export interface IWebinarDocument extends Omit<IWebinar, '_id'>, I4HDocument {}

// @ts-ignore: validate causing whole schema to error
const webinarSchema = new mongoose.Schema({
  category: {
    required: 'category is required',
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  description: {
    required: 'description is required',
    type: String,
  },
  title: {
    required: 'title is required',
    type: String,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  url: {
    required: 'url is required',
    type: String,
  },
})

webinarSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

webinarSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

export default mongoose.model<IWebinarDocument>('Webinar', webinarSchema)
