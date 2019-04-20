import mongoose, { Document } from 'mongoose'
import slugify from 'slugify'
import { IPartner, Omit } from '../sharedTypes'

export interface IPartnerDocument extends Omit<IPartner, '_id'>, Document {}

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
  image: {
    required: true,
    type: imageSchema,
  },
  title: {
    required: true,
    trim: true,
    type: String,
  },
  url: {
    required: true,
    trim: true,
    type: String,
  },
})

const partnerSchema = new mongoose.Schema({
  featuredImage1: { type: imageSchema, required: 'Please submit at least one featured image' },
  featuredImage2: imageSchema,
  links: [String],
  longDescription: { type: String, required: 'Please enter a long description' },
  reports: [reportSchema],
  shortDescription: { type: String, required: 'Please enter a short description' },
  slug: String,
  title: { type: String, required: 'Please enter a title' },
})

partnerSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    next()
    return
  }
  ;(this as any).slug = slugify((this as any).title)
  next()
})

partnerSchema.pre('findOneAndUpdate', function(next) {
  const title = this.getUpdate().title
  if (title) {
    ;(this as any)._update.slug = slugify(title)
    next()
  } else {
    next()
    return
  }
})

export default mongoose.model<IPartnerDocument>('Partner', partnerSchema)
