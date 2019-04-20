import mongoose, { Document } from 'mongoose'
import { ICampWithDates, Omit } from '../sharedTypes'

export interface ICampDocument extends Omit<ICampWithDates, '_id'>, Document {}

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
  endDate: String,
})

const campSchema = new mongoose.Schema({
  ageRange: {
    required: 'AgeRange is Required',
    type: String,
  },
  city: {
    required: 'City is Required',
    type: String,
  },
  contact: {
    required: 'Contact is Required',
    type: campContactSchema,
  },
  dates: {
    required: 'Camp Dates are Required',
    type: [campDateSchema],
  },
  description: {
    required: 'Description is Required',
    type: String,
  },
  descriptionTitle: {
    required: 'DescriptionTitle is Required',
    type: String,
  },
  featuredImage: { type: imageSchema },
  state: {
    required: 'State is Required',
    type: String,
  },
  title: {
    required: 'Title is Required',
    type: String,
  },
})

export default mongoose.model('Camp', campSchema)
