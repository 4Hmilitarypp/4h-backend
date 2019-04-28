import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify'

import { ILesson, IResourceWithLessons, Omit } from '../sharedTypes'

export interface IResourceDocument extends Omit<IResourceWithLessons, '_id'>, Document {
  createdAt: number
  lessons: ILesson[]
  updatedAt: number
}

const featuredImageSchema = new mongoose.Schema({
  _id: { auto: false },
  alt: {
    default: 'resource cover',
    type: String,
  },
  url: {
    required: 'image url is required',
    trim: true,
    type: String,
  },
})

const linkSchema = new mongoose.Schema({
  _id: { auto: false },
  type: { type: String, enum: ['doc', 'pdf', 'external', 'ppt'] },
  url: { trim: true, type: String },
})

const lessonSchema = new mongoose.Schema({
  category: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  links: [linkSchema],
  title: {
    required: 'lesson title is required',
    trim: true,
    type: String,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

const ResourceSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  featuredImage: featuredImageSchema,
  lessons: [lessonSchema],
  longDescription: {
    required: 'long description is required',
    type: String,
  },
  shortDescription: {
    maxlength: 300,
    required: 'short description is required',
    type: String,
  },
  slug: String,
  title: {
    required: 'title is required',
    trim: true,
    type: String,
    unique: true,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

ResourceSchema.plugin(uniqueValidator, { message: 'Error, expected value `{VALUE}` at `{PATH}` to be unique.' })

ResourceSchema.pre('save', function(this: IResourceDocument, next) {
  this.updatedAt = Date.now()
  if (!this.isModified('title')) {
    next()
    return
  }
  this.slug = slugify(this.title, { lower: true })
  next()
})

ResourceSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  const title = this.getUpdate().title
  if (title) {
    ;(this as any)._update.slug = slugify(title, { lower: true })
    next()
  } else {
    next()
    return
  }
})

lessonSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

lessonSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

export default mongoose.model<IResourceDocument>('Resource', ResourceSchema, 'resources')
