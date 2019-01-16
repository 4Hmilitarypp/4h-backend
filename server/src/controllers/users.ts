import { pick } from 'lodash'
import mongoose from 'mongoose'
import passport from 'passport'
import validator from 'validator'

import { IUserDocument } from '../models/User'
import { Controller } from '../types'

const cleanRegister = (obj: any) => pick(obj, ['email', 'password', 'confirmPassword', 'name'])
const createSafeUser = (obj: any) => pick(obj, ['_id', 'email', 'name', 'permissions'])

const User = mongoose.model<IUserDocument>('User')

// POST new user
export const register: Controller = async (req, res) => {
  const { email, password, confirmPassword, name } = cleanRegister(req.body)
  const errors: string[] = []
  if (!validator.isEmail(email)) {
    errors.push('please input a valid email')
  }
  const cleanEmail = validator.normalizeEmail(email, {
    all_lowercase: true,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  })
  if (password.length < 1) {
    errors.push('Please input a password')
  }
  if (confirmPassword.length < 1) {
    errors.push('Please input a confirmed password')
  }
  if (password !== confirmPassword) {
    errors.push('The password and confirmed password are not the same')
  }

  if (errors.length > 0) {
    return res.status(400).send(errors.join('. '))
  }

  const user = new User({ email: cleanEmail, password, name })
  await user.setPassword(password)
  const safeUser = createSafeUser(await user.save())
  const token = await user.generateJWT()
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
  })
  return res.status(201).json(safeUser)
}

// POST login
export const login: Controller = async (req, res, next) => {
  return passport.authenticate('local', { session: false }, async (err, passportUser: IUserDocument, options) => {
    if (err && next) {
      return next(err)
    }
    if (passportUser) {
      const token = await passportUser.generateJWT()
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === 'production',
      })
      return res.json(createSafeUser(passportUser))
    }
    return res.status(401).send(options.message)
  })(req, res, next)
}

export const logout: Controller = async (_, res) => {
  res.clearCookie('token')
  return res.send('Goodbye!')
}

// GET current user
export const me: Controller = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.sendStatus(404)
  } else {
    return res.json(createSafeUser(user))
  }
}
