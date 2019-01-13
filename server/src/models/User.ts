import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { promisify } from 'util'
import { IUser } from '../sharedTypes'

// bcryptjs uses callbacks, and so I turn them into promises withe node's promisify util
const bcryptSalt = promisify(bcrypt.genSalt)
const bcryptHash = promisify(bcrypt.hash)
const bcryptCompare = promisify(bcrypt.compare)

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
