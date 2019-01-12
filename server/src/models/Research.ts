import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { IResearch, Omit } from '../sharedTypes'

export interface IResearchDocument extends Omit<IResearch, '_id'>, Document {}

// @ts-ignore: validate causing whole schema to error
const researchSchema = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  title: {
    required: 'title is required',
    type: String,
    unique: true,
  },
  type: { type: String, enum: ['doc', 'pdf', 'external'] },
  url: {
    required: 'url is required',
    type: String,
  },
})

researchSchema.plugin(uniqueValidator)

export default mongoose.model<IResearchDocument>('Research', researchSchema)
