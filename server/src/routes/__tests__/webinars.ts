import mongoose from 'mongoose'
import request from 'supertest'

import app from '../../app'
import { IUserDocument } from '../../models/User'
import { IWebinarDocument } from '../../models/Webinar'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'webinars'

const Webinar = mongoose.model<IWebinarDocument>('Webinar')
const User = mongoose.model<IUserDocument>('User')

const getToken = (res: request.Response) => res.header['set-cookie'][0].split('token=')[1].split(';')[0]

const setup = async () => {
  const user = generate.dbUser({ permissions: ['admin'] })
  const dbUser = new User(user)
  await dbUser.setPassword(user.password)
  await dbUser.save()
  const res = await request(app)
    .post('/api/users/login')
    .send(user)
  const cookie = res.header['set-cookie'][0] as string
  const token = getToken(res) as string
  return { token, cookie }
}

/**
 * GET
 */
it('should return a 200 if get was successful', async () => {
  const webinar = generate.webinar()
  await new Webinar(webinar).save()
  const inDb = await Webinar.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).get('/api/webinars')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1)
  expect(res.body[0]).toMatchObject({ ...webinar, _id: expect.any(String) })
})

/**
 * POST
 */
it('should return a 201 if created was successful', async () => {
  const { cookie } = await setup()
  const webinar = generate.webinar()

  const res = await request(app)
    .post('/api/webinars')
    .set('cookie', cookie)
    .send(webinar)

  expect(res.status).toBe(201)
  expect(res.body).toMatchObject({ ...webinar, _id: expect.any(String) })
  const inDb = await Webinar.find()
  expect(formatDb(inDb[0])).toMatchObject({ ...webinar, _id: res.body._id })
})

it('should return a 400 if a webinar with a bad form is created', async () => {
  const { cookie } = await setup()
  const webinar = generate.webinar(100, { description: null })
  const res = await request(app)
    .post('/api/webinars')
    .set('cookie', cookie)
    .send(webinar)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Webinar.find()
  expect(finalInDb).toHaveLength(0)
})

/**
 * PUT
 */
it('should return a 200 if the update was successful', async () => {
  const { cookie } = await setup()
  const originalWebinar = generate.webinar()
  const inDb = await new Webinar(originalWebinar).save()
  const existingId = inDb._id.toString()

  const updateWebinar = generate.webinar()

  const res = await request(app)
    .put(`/api/webinars/${existingId}`)
    .set('cookie', cookie)
    .send(updateWebinar)

  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject({ ...updateWebinar, _id: existingId })
  const finalInDb = await Webinar.findById(res.body._id)
  expect(formatDb(finalInDb)).toMatchObject({ ...updateWebinar, _id: existingId })
})

it('should return a 400 if any of the fields are messed up', async () => {
  const { cookie } = await setup()
  const originalWebinar = generate.webinar()
  const inDb = await new Webinar(originalWebinar).save()
  const existingId = inDb._id.toString()

  const updateWebinar = generate.webinar(100, { title: null })

  const res = await request(app)
    .put(`/api/webinars/${existingId}`)
    .set('cookie', cookie)
    .send(updateWebinar)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Webinar.findById(inDb._id)
  expect(formatDb(finalInDb)).toMatchObject(originalWebinar)
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Webinar.find()
  expect(inDb).toHaveLength(0)
  const updateWebinar = generate.webinar()
  const fakeId = generate.objectId()

  const res = await request(app)
    .put(`/api/webinars/${fakeId}`)
    .set('cookie', cookie)
    .send(updateWebinar)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})

/**
 * DELETE
 */
it('should return a 204 if delete was successful', async () => {
  const { cookie } = await setup()
  const webinar = generate.webinar()
  const created = await new Webinar(webinar).save()
  const inDb = await Webinar.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .delete(`/api/webinars/${created._id}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(204)
  expect(res.body).toMatchObject({})
  const finalInDb = await Webinar.find()
  expect(finalInDb).toHaveLength(0)
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Webinar.find()
  expect(inDb).toHaveLength(0)
  const fakeId = generate.objectId()

  const res = await request(app)
    .delete(`/api/webinars/${fakeId}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})
