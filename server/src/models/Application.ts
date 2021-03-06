import mongoose from 'mongoose'
import { IApplication, Omit, I4HDocument } from '../sharedTypes'

export interface IApplicationDocument extends Omit<IApplication, '_id'>, I4HDocument {}

const applicationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  dueDate: { type: Date, required: 'due date is required' },
  title: { type: String, required: 'application title is required' },
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
