import * as Sentry from '@sentry/node'
import axios from 'axios'
import { pick } from 'lodash'
import mongoose from 'mongoose'
import passport from 'passport'
import validator from 'validator'
import registration from '../emailTemplates/registration'
import userModified from '../emailTemplates/userModified'
import { IUserDocument } from '../models/User'
import { Controller } from '../types'
import { captchaError, emailError, notFoundError } from '../utils/errors'
import transporter from '../utils/nodemailer'

const cleanRegister = (obj: any) =>
  pick(obj, ['affiliation', 'email', 'password', 'confirmPassword', 'name', 'university'])
const createSafeUser = (obj: any) => pick(obj, ['_id', 'affiliation', 'email', 'name', 'permissions', 'university'])

const User = mongoose.model<IUserDocument>('User')
const Archive = mongoose.model('Archive')

export const getUsers: Controller = async (_, res) => {
  const users = await User.find()
  const safeUsers = users ? users.map(createSafeUser) : []
  return res.json(safeUsers)
}

export const updateUser: Controller = async (req, res) => {
  const { _id } = req.params
  const user = await User.findByIdAndUpdate(
    _id,
    { ...createSafeUser(req.body), updatedBy: req.user.email },
    {
      context: 'query',
      new: true,
      runValidators: true,
    }
  )
  if (user) {
    try {
      await transporter.sendMail({
        from: `"4-H Military Partnerships" <${process.env.EMAIL_USER}>`,
        html: userModified(user.name),
        subject: 'User Was Updated',
        text: '',
        to: user.email,
      })
    } catch (err) {
      throw emailError(err)
    }

    return res.status(200).json(createSafeUser(user))
  }
  throw notFoundError
}

export const deleteUser: Controller = async (req, res) => {
  const { _id } = req.params
  const deletedUser = await User.findByIdAndDelete(_id)
  if (deletedUser) {
    await new Archive({ archivedBy: req.user.email, record: createSafeUser(deletedUser), type: 'user' }).save()
    return res.status(204).send()
  }
  throw notFoundError
}

export const createUser: Controller = async (req, res) => {
  const { affiliation, email, password, confirmPassword, name, university } = cleanRegister(req.body)
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
    return res.status(400).send({ message: errors.join('. ') })
  }

  const user = new User({
    affiliation,
    createdBy: req.user.email,
    email: cleanEmail,
    name,
    password,
    university,
    updatedBy: req.user.email,
  })
  await user.setPassword(password)
  const safeUser = createSafeUser(await user.save())

  return res.status(201).json(safeUser)
}

// POST new user
export const register: Controller = async (req, res) => {
  const { email, password, confirmPassword, name, university } = cleanRegister(req.body)
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
    return res.status(400).send({ message: errors.join('. ') })
  }

  const user = new User({
    affiliation: req.body.affiliation,
    createdBy: 'register',
    email: cleanEmail,
    name,
    password,
    university,
    updatedBy: 'register',
  })
  await user.setPassword(password)
  const safeUser = createSafeUser(await user.save())
  const token = await user.generateJWT()

  // send email to Meredith / Suzie
  try {
    await transporter.sendMail({
      from: `"4-H Military Partnerships" <${process.env.EMAIL_USER}>`,
      html: registration(user.name, user.email, user.affiliation, user.university),
      subject: 'New User Registered',
      text: '',
      to: 'alex@wendte.tech',
    })
  } catch (err) {
    await User.findByIdAndDelete(user._id)
    throw emailError(err)
  }

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
  })
  Sentry.configureScope(scope => {
    scope.setUser({ email: cleanEmail || undefined, name })
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
      Sentry.configureScope(scope => {
        scope.setUser({ email: passportUser.email, name: passportUser.name })
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

export const checkIfSpam: Controller = async (req, res) => {
  const response: any = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    `response=${req.body.token}&secret=${process.env.CAPTCHA_SECRET}`
  )
  if (!response.data.success) {
    throw captchaError(response.data)
  }
  return res.send(response.data.score < 0.6)
}

// GET current user
export const me: Controller = async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id)
    if (!user) {
      res.clearCookie('token')
      return res.sendStatus(404)
    } else {
      Sentry.configureScope(scope => {
        scope.setUser({ email: user.email, name: user.name })
      })
      return res.json(createSafeUser(user))
    }
  }
  // there is no user in the request, so there is no valid token, so just send an empty body
  else {
    res.clearCookie('token')
    return res.send()
  }
}
