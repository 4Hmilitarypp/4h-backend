import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import validator from 'validator'

import { ILiaison, Omit, I4HDocument } from '../sharedTypes'

export interface ILiaisonDocument extends Omit<ILiaison, '_id'>, I4HDocument {}

// @ts-ignore: validate causing whole schema to error
const liaisonSchema = new mongoose.Schema({
  abbreviation: {
    trim: true,
    type: String,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  email: {
    trim: true,
    type: String,
    validate: [validator.isEmail, 'Invalid Email Address'],
  },
  image: {
    required: 'Please enter an image url',
    type: String,
  },
  name: String,
  phoneNumber: { type: String, validate: [validator.isMobilePhone, 'Invalid Phone Number'] },
  region: { type: String, required: 'Please Enter a region', unique: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

liaisonSchema.pre('save', function(this: any, next: any) {
  this.updatedAt = Date.now()
  next()
})

liaisonSchema.pre('findOneAndUpdate', function(this: any, next: any) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

liaisonSchema.plugin(uniqueValidator)

export default mongoose.model<ILiaisonDocument>('Liaison', liaisonSchema)
