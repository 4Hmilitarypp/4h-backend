import mongoose from 'mongoose'
import slugify from 'slugify'
import { IPartner, Omit, I4HDocument } from '../sharedTypes'

export interface IPartnerDocument extends Omit<IPartner, '_id'>, I4HDocument {}

const imageSchema = new mongoose.Schema({
  _id: { auto: false },
  alt: {
    default: 'report cover',
    trim: true,
    type: String,
  },
  url: {
    required: 'image url is required',
    trim: true,
    type: String,
  },
})

const reportSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  image: {
    required: true,
    type: imageSchema,
  },
  title: {
    required: true,
    trim: true,
    type: String,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  url: {
    required: true,
    trim: true,
    type: String,
  },
})

const partnerSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  featuredImage1: { type: imageSchema, required: 'Please submit at least one featured image' },
  featuredImage2: imageSchema,
  links: [String],
  longDescription: { type: String, required: 'Please enter a long description' },
  reports: [reportSchema],
  shortDescription: { type: String, required: 'Please enter a short description' },
  slug: String,
  title: { type: String, required: 'Please enter a title' },
})

partnerSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  if (!this.isModified('title')) {
    next()
    return
  }
  ;(this as any).slug = slugify((this as any).title, { lower: true })
  next()
})

partnerSchema.pre('findOneAndUpdate', function(next) {
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

export default mongoose.model<IPartnerDocument>('Partner', partnerSchema)
