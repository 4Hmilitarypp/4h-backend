import mongoose from 'mongoose'
import request from 'supertest'

import app from '../../app'
import { IResearchDocument } from '../../models/Research'
import { IUserDocument } from '../../models/User'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'research'

const Research = mongoose.model<IResearchDocument>('Research')
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
  const research = generate.research()
  await new Research(research).save()
  const inDb = await Research.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).get('/api/research')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1)
  expect(res.body[0]).toMatchObject({ ...research, _id: expect.any(String) })
})

/**
 * POST
 */
it('should return a 201 if created was successful', async () => {
  const { cookie } = await setup()
  const research = generate.research()

  const res = await request(app)
    .post('/api/research')
    .set('cookie', cookie)
    .send(research)

  expect(res.status).toBe(201)
  expect(res.body).toMatchObject({ ...research, _id: expect.any(String) })
  const inDb = await Research.findOne()
  expect(formatDb(inDb)).toMatchObject({ ...research, _id: res.body._id })
})

it('should return a 400 if a research with a duplicate title is created', async () => {
  const { cookie } = await setup()
  const research = generate.research(100, { title: 'First Item Title' })
  await new Research(research).save()
  const inDb = await Research.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .post('/api/research')
    .set('cookie', cookie)
    .send(research)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Research.find()
  expect(finalInDb).toHaveLength(1)
})

/**
 * PUT
 */
it('should return a 200 if the update was successful', async () => {
  const { cookie } = await setup()
  const originalResearch = generate.research()
  const inDb = await new Research(originalResearch).save()
  const existingId = inDb._id.toString()

  const updateResearch = generate.research()

  const res = await request(app)
    .put(`/api/research/${existingId}`)
    .set('cookie', cookie)
    .send(updateResearch)

  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject({ ...updateResearch, _id: existingId })
  const finalInDb = await Research.findById(res.body._id)
  expect(formatDb(finalInDb)).toMatchObject({ ...updateResearch, _id: existingId })
})

it('should return a 400 if any of the fields are messed up', async () => {
  const { cookie } = await setup()
  const originalResearch = generate.research()
  const inDb = await new Research(originalResearch).save()
  const existingId = inDb._id.toString()

  const updateResearch = generate.research(100, { title: null })

  const res = await request(app)
    .put(`/api/research/${existingId}`)
    .set('cookie', cookie)
    .send(updateResearch)

  expect(res.status).toEqual(400)
  expect(res.body).toMatchObject({ message: expect.any(String) })
  const finalInDb = await Research.findById(inDb._id)
  expect(formatDb(finalInDb)).toMatchObject({ ...originalResearch, _id: existingId })
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Research.find()
  expect(inDb).toHaveLength(0)
  const updateResearch = generate.research(100)
  const fakeId = generate.objectId()
  const res = await request(app)
    .put(`/api/research/${fakeId}`)
    .set('cookie', cookie)
    .send(updateResearch)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})

/**
 * DELETE
 */
it('should return a 204 if delete was successful', async () => {
  const { cookie } = await setup()
  const research = generate.research()
  const created = await new Research(research).save()
  const inDb = await Research.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .delete(`/api/research/${created._id}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(204)
  expect(res.body).toMatchObject({})
  const finalInDb = await Research.find()
  expect(finalInDb).toHaveLength(0)
})

it('should return a 404 if not found', async () => {
  const { cookie } = await setup()
  const inDb = await Research.find()
  expect(inDb).toHaveLength(0)

  const res = await request(app)
    .delete(`/api/research/${generate.objectId()}`)
    .set('cookie', cookie)

  expect(res.status).toEqual(404)
  expect(res.body).toMatchObject({})
})
