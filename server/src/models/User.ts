import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUser } from '../sharedTypes'

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>
  validatePassword: (password: string) => Promise<boolean>
  generateJWT: () => string
}

const UsersSchema = new mongoose.Schema({
  email: {
    required: 'email is required',
    type: String,
    unique: true,
  },
  name: {
    required: 'name is required',
    type: String,
  },
  password: {
    required: 'password is required',
    type: String,
  },
  permissions: {
    default: [],
    type: [String],
  },
})

UsersSchema.methods.setPassword = async function(this: IUserDocument, password: string) {
  this.password = await bcrypt.hash(password, 10)
}

UsersSchema.methods.validatePassword = async function(this: IUserDocument, password: string) {
  const isValid = await bcrypt.compare(password, this.password)
  return isValid
}

UsersSchema.methods.generateJWT = function(this: IUserDocument): string {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      exp: expirationDate.getTime() / 1000,
      permissions: this.permissions,
    },
    process.env.JWT_SECRET || 'secret!'
  )
}

UsersSchema.plugin(uniqueValidator)

export default mongoose.model<IUserDocument>('User', UsersSchema)
