import mongoose from 'mongoose'
import { ICampWithDates, Omit, I4HDocument } from '../sharedTypes'

export interface ICampDocument extends Omit<ICampWithDates, '_id'>, I4HDocument {}

const imageSchema = new mongoose.Schema({
  _id: { auto: false },
  alt: {
    trim: true,
    type: String,
  },
  url: {
    required: 'image url is required',
    trim: true,
    type: String,
  },
})

const campContactSchema = new mongoose.Schema({
  email: String,
  name: String,
  phoneNumber: String,
  url: String,
  urlText: String,
})

const campDateSchema = new mongoose.Schema({
  beginDate: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  endDate: String,
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

const campSchema = new mongoose.Schema({
  ageRange: {
    required: 'AgeRange is required',
    type: String,
  },
  city: {
    required: 'City is required',
    type: String,
  },
  contact: {
    required: 'Contact is required',
    type: campContactSchema,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  dates: {
    required: 'Camp Dates are required',
    type: [campDateSchema],
  },
  description: {
    required: 'Description is required',
    type: String,
  },
  descriptionTitle: {
    required: 'DescriptionTitle is required',
    type: String,
  },
  featuredImage: { type: imageSchema },
  flyerUrl: String,
  serviceBranch: {
    enum: ['Air Force', 'Navy', 'Army'],
    required: 'Service branch is required',
    type: String,
  },
  state: {
    required: 'State is required',
    type: String,
  },
  title: {
    required: 'Title is required',
    type: String,
  },
  type: {
    enum: ['Residential', 'Day'],
    type: String,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

campSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

campSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

campDateSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

campDateSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

export default mongoose.model('Camp', campSchema)
