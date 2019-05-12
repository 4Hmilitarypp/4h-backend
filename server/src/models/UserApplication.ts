import mongoose from 'mongoose'
import { IUserApplication, Omit } from '../sharedTypes'

export interface IUserApplicationDocument extends Omit<IUserApplication, '_id'>, mongoose.Document {}

const userCommentSchema = new mongoose.Schema({
  text: { type: String, required: 'comment text is required' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: 'userId is required' },
})

const userApplicationSchema = new mongoose.Schema({
  baseId: { type: mongoose.Schema.Types.ObjectId, required: 'baseId is required' },
  comments: { default: [], type: [userCommentSchema] },
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  dueDate: { type: Date, required: 'due date is required' },
  name: { type: String, required: 'application name is required' },
  status: { type: String, enum: ['Not Submitted', 'Late', 'Rejected', 'Approved'], default: 'Not Submitted' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  url: String,
  userGroups: { default: [], type: [String] },
  userId: { required: 'userId is a required', type: mongoose.Schema.Types.ObjectId },
})

userApplicationSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

userApplicationSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

export default mongoose.model<IUserApplicationDocument>('UserApplication', userApplicationSchema, 'user-application')
