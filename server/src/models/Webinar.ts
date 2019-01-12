import mongoose, { Document } from 'mongoose'
import { IWebinar, Omit } from '../sharedTypes'

export interface IWebinarDocument extends Omit<IWebinar, '_id'>, Document {}

// @ts-ignore: validate causing whole schema to error
const webinarSchema = new mongoose.Schema({
  category: {
    required: 'category is required',
    type: String,
  },
  description: {
    required: 'description is required',
    type: String,
  },
  title: {
    required: 'title is required',
    type: String,
  },
  url: {
    required: 'url is required',
    type: String,
  },
})

export default mongoose.model<IWebinarDocument>('Webinar', webinarSchema)
