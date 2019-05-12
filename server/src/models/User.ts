import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { promisify } from 'util'
import { IUser, Omit } from '../sharedTypes'

// bcryptjs uses callbacks, and so I turn them into promises withe node's promisify util
const bcryptSalt = promisify(bcrypt.genSalt)
const bcryptHash = promisify(bcrypt.hash)
const bcryptCompare = promisify(bcrypt.compare)

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  setPassword: (password: string) => Promise<void>
  validatePassword: (password: string) => Promise<boolean>
  generateJWT: () => string
}

const UsersSchema = new mongoose.Schema({
  affiliation: {
    required: 'affiliation is required',
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  email: {
    required: 'email is required',
    trim: true,
    type: String,
    unique: true,
  },
  name: {
    required: 'name is required',
    trim: true,
    type: String,
  },
  password: {
    required: 'password is required',
    type: String,
  },
  roles: {
    default: [],
    type: [{ type: String, enum: ['admin', 'liaison', 'application-user'] }],
  },
  university: { type: String, required: 'university is required' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
})

UsersSchema.methods.setPassword = async function(this: IUserDocument, password: string) {
  const salt = await bcryptSalt()
  // @ts-ignore
  this.password = (await bcryptHash(password, salt)) as string
}

UsersSchema.methods.validatePassword = async function(this: IUserDocument, password: string) {
  const isValid = await bcryptCompare(password, this.password)
  return isValid
}

UsersSchema.methods.generateJWT = function(this: IUserDocument): string {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set')
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      exp: expirationDate.getTime() / 1000,
      permissions: this.roles,
    },
    process.env.JWT_SECRET
  )
}

UsersSchema.pre('save', function(this: any, next) {
  this.updatedAt = Date.now()
  next()
})

UsersSchema.pre('findOneAndUpdate', function(this: any, next) {
  ;(this as any)._update.updatedAt = Date.now()
  next()
})

UsersSchema.plugin(uniqueValidator)

export default mongoose.model<IUserDocument>('User', UsersSchema)
