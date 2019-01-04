import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify'
import { ILesson, IResource, Omit } from '../sharedTypes'

export interface IResourceDocument extends Omit<IResource, '_id'>, Document {
  lessons: ILesson[]
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
  type: String,
  url: { trim: true, type: String },
})

const lessonSchema = new mongoose.Schema({
  category: String,
  links: [linkSchema],
  title: {
    required: 'lesson title is required',
    trim: true,
    type: String,
  },
})

const resource = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  featuredImage: featuredImageSchema,
  lessons: [lessonSchema],
  slug: String,
  title: {
    required: 'title is required',
    trim: true,
    type: String,
    unique: true,
  },
})

resource.plugin(uniqueValidator, { message: 'Error, expected value `{VALUE}` at `{PATH}` to be unique.' })

resource.pre('save', function(this: IResourceDocument, next) {
  if (!this.isModified('title')) {
    next()
    return
  }
  this.slug = slugify(this.title)
  next()
})

resource.pre('findOneAndUpdate', function(next) {
  const title = this.getUpdate().title
  if (title) {
    ;(this as any)._update.slug = slugify(title)
    next()
  } else {
    next()
    return
  }
})

export default mongoose.model<IResourceDocument>('Resource', resource, 'resources')
