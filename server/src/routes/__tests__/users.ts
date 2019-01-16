import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import request from 'supertest'
import { promisify } from 'util'

import app from '../../app'
import { IUserDocument } from '../../models/User'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'users'

const User = mongoose.model<IUserDocument>('User')

const getToken = (res: request.Response) => res.header['set-cookie'][0].split('token=')[1].split(';')[0]
const bcryptCompare = promisify(bcrypt.compare)

const setup = async () => {
  const registerForm = generate.registerForm()
  const res = await request(app)
    .post('/api/users/register')
    .send(registerForm)
  const cookie = res.header['set-cookie'][0] as string
  const token = getToken(res) as string
  return { registerForm, token, cookie }
}

it('/register: should return a valid cookie and store the user in the database correctly', async () => {
  const registerForm = generate.registerForm()
  const res = await request(app)
    .post('/api/users/register')
    .send(registerForm)

  expect(res.status).toBe(201)
  expect(res.body).toMatchObject({
    _id: expect.any(String),
    email: registerForm.email.toLowerCase(),
    name: registerForm.name,
    permissions: [],
  })
  expect(res.header['set-cookie']).toEqual([expect.stringContaining('token=')])
  const token = getToken(res)
  const deserialized = await (jwt.verify(token, process.env.JWT_SECRET || '') as any)
  expect(deserialized.email).toBe(registerForm.email.toLowerCase())

  const inDb = await User.findOne()
  expect(formatDb(inDb)).toMatchObject({
    _id: expect.any(String),
    email: registerForm.email.toLowerCase(),
    name: registerForm.name,
    password: expect.any(String),
  })
  const isValid = await bcryptCompare(registerForm.password, (inDb as IUserDocument).password)
  expect(isValid).toBe(true)
})

it('/login: should log the existing user in and set a response cookie', async () => {
  const { registerForm } = await setup()

  const loginForm = { email: registerForm.email.toLowerCase(), password: registerForm.password }
  const res = await request(app)
    .post('/api/users/login')
    .send(loginForm)
  const token = getToken(res) as string
  const deserializedToken = await (jwt.verify(token, process.env.JWT_SECRET || '') as any)

  expect(deserializedToken.email).toBe(registerForm.email.toLowerCase())
  expect(res.status).toBe(200)
  expect(res.body).toEqual({
    _id: expect.any(String),
    email: registerForm.email.toLowerCase(),
    name: registerForm.name,
    permissions: [],
  })
})

it('/logout: should not have a cookie in the response header', async () => {
  await setup()

  const res = await request(app)
    .post('/api/users/logout')
    .send()

  expect(res.status).toBe(200)
  const token = getToken(res)
  expect(token).toBe('')
})

it('/me: should return the current user', async () => {
  const { cookie, registerForm } = await setup()

  const res = await request(app)
    .get('/api/users/me')
    .set('cookie', cookie)
    .send()

  expect(res.status).toBe(200)
  expect(res.body).toEqual({
    _id: expect.any(String),
    email: registerForm.email.toLowerCase(),
    name: registerForm.name,
    permissions: [],
  })
})
