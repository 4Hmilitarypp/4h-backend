import mongoose from 'mongoose'
import { IUserApplication, Omit, I4HDocument } from '../sharedTypes'

export interface IUserApplicationDocument extends Omit<IUserApplication, '_id'>, I4HDocument {}

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
  status: {
    default: 'Not Submitted',
    enum: ['Not Submitted', 'Submitted', 'Late', 'Rejected', 'Approved'],
    type: String,
  },
  title: { type: String, required: 'application title is required' },
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
