import mongoose from 'mongoose'
import { IApplication, Omit } from '../sharedTypes'

export interface IApplicationDocument extends Omit<IApplication, '_id'>, mongoose.Document {}

const applicationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  dueDate: { type: Date, required: 'due date is required' },
  name: { type: String, required: 'application name is required' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  url: String,
  userGroups: { default: [], type: [String] },
})

applicationSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

applicationSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

export default mongoose.model<IApplicationDocument>('Application', applicationSchema, 'application')
