import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { IResearch, Omit } from '../sharedTypes'

export interface IResearchDocument extends Omit<IResearch, '_id'>, Document {}

// @ts-ignore: validate causing whole schema to error
const researchSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
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
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  url: {
    required: 'url is required',
    type: String,
  },
})

researchSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

researchSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

researchSchema.plugin(uniqueValidator)

export default mongoose.model<IResearchDocument>('Research', researchSchema)
