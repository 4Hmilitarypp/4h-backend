import mongoose from 'mongoose'
import passport from 'passport'
import { Strategy } from 'passport-local'
import validator from 'validator'

import { IUserDocument } from '../models/User'

const Users = mongoose.model<IUserDocument>('User')
passport.use(
  new Strategy(
    {
      passwordField: 'password',
      usernameField: 'email',
    },
    async (email: string, password: string, done) => {
      try {
        const cleanEmail = validator.normalizeEmail(email, {
          all_lowercase: true,
          gmail_remove_dots: false,
          gmail_remove_subaddress: false,
        })
        const user = await Users.findOne({ email: cleanEmail })
        if (user) {
          const res = await user.validatePassword(password)
          console.log(res)
        }
        const isValid = user && (await user.validatePassword(password))
        if (isValid) {
          return done(null, user)
        } else {
          // err, user, options
          return done(null, null, { message: 'email or password is invalid' })
        }
      } catch (error) {
        done(error)
      }
    }
  )
)
