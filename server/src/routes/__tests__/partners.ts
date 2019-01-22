import mongoose from 'mongoose'
import request from 'supertest'

import slugify from 'slugify'
import app from '../../app'
import { IPartnerDocument } from '../../models/Partner'
import { IUserDocument } from '../../models/User'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'partners'

const Partner = mongoose.model<IPartnerDocument>('Partner')
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
it('should return only a partnerSection if get was successful', async () => {
  const partner = generate.partner()
  await new Partner(partner).save()
  const inDb = await Partner.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).get('/api/partners')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1)
  expect(res.body[0]).toMatchObject({
    _id: expect.any(String),
    shortDescription: inDb[0].shortDescription,
    slug: slugify(inDb[0].title),
    title: inDb[0].title,
  })
})

/**
 * POST
 */
it('should return a 201 if created was successful', async () => {
  const { cookie } = await setup()
  const partner = generate.partner()

  const res = await request(app)
    .post('/api/partners')
    .set('cookie', cookie)
    .send(partner)

  expect(res.status).toBe(201)
  expect(res.body).toMatchObject({ ...partner, _id: expect.any(String), slug: slugify(partner.title) })
  const inDb = await Partner.find()
  expect(formatDb(inDb[0])).toMatchObject({
    ...partner,
    _id: res.body._id,
    slug: slugify(inDb[0].title),
  })
})

it('should return a 400 if a partner with a bad form is created', async () => {
  const { cookie } = await setup()
  const partner = generate.partner({ title: '' })
  const res = await request(app)
    .post('/api/partners')
    .set('cookie', cookie)
    .send(partner)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Partner.find()
  expect(finalInDb).toHaveLength(0)
})

/**
 * PUT
 */
it('should return a 200 if the update was successful', async () => {
  const { cookie } = await setup()
  const originalPartner = generate.partner()
  const inDb = await new Partner(originalPartner).save()
  const existingId = inDb._id.toString()

  const updatePartner = generate.partner()

  const res = await request(app)
    .put(`/api/partners/${existingId}`)
    .set('cookie', cookie)
    .send(updatePartner)

  expect(res.body).toMatchObject({ ...updatePartner, _id: existingId, slug: slugify(updatePartner.title) })
  expect(res.status).toEqual(200)
  const finalInDb = await Partner.findById(res.body._id)
  expect(formatDb(finalInDb)).toMatchObject({
    ...updatePartner,
    _id: existingId,
    slug: slugify(finalInDb ? finalInDb.title : ''),
  })
})

it('should return a 400 if any of the fields are messed up', async () => {
  const { cookie } = await setup()
  const originalPartner = generate.partner()
  const inDb = await new Partner(originalPartner).save()
  const existingId = inDb._id.toString()

  const updatePartner = generate.partner({ title: '' })

  const res = await request(app)
    .put(`/api/partners/${existingId}`)
    .set('cookie', cookie)
    .send(updatePartner)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Partner.findById(inDb._id)
  expect(formatDb(finalInDb)).toMatchObject({ ...originalPartner, slug: slugify(finalInDb ? finalInDb.title : '') })
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Partner.find()
  expect(inDb).toHaveLength(0)
  const updatePartner = generate.partner()
  const fakeId = generate.objectId()

  const res = await request(app)
    .put(`/api/partners/${fakeId}`)
    .set('cookie', cookie)
    .send(updatePartner)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})

/**
 * DELETE
 */
it('should return a 204 if delete was successful', async () => {
  const { cookie } = await setup()
  const partner = generate.partner()
  const created = await new Partner(partner).save()
  const inDb = await Partner.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .delete(`/api/partners/${created._id}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(204)
  expect(res.body).toMatchObject({})
  const finalInDb = await Partner.find()
  expect(finalInDb).toHaveLength(0)
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Partner.find()
  expect(inDb).toHaveLength(0)
  const fakeId = generate.objectId()

  const res = await request(app)
    .delete(`/api/partners/${fakeId}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})
