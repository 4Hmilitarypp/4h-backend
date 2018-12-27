import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../app'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'liaisons'

const Liaison = mongoose.model('Liaison')

/**
 * GET
 */
it('should return a 200 if get was successful', async () => {
  const liaison = generate.liaison({ abbreviation: 'KSA' })
  await new Liaison(liaison).save()
  const inDb = await Liaison.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).get('/api/liaisons')
  expect(res.status).toBe(200)
  expect(res.body).toEqual([{ ...liaison, _id: expect.any(String) }])
})

/**
 * POST
 */
it('should return a 201 if created was successful', async () => {
  const liaison = generate.liaison({ abbreviation: 'KSA' })

  const res = await request(app)
    .post('/api/liaisons')
    .send(liaison)

  expect(res.status).toBe(201)
  expect(res.body).toEqual({ ...liaison, _id: expect.any(String) })
  const inDb = await Liaison.find()
  expect(formatDb(inDb[0])).toMatchObject(liaison)
})

it('should return a 400 if a liaison with a duplicate abbreviation is created', async () => {
  const liaison = generate.liaison({ abbreviation: 'KSA' })
  await new Liaison(liaison).save()
  const inDb = await Liaison.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .post('/api/liaisons')
    .send(liaison)

  expect(res.status).toEqual(400)
  expect(res.body).toEqual({ message: expect.any(String) })
  const finalInDb = await Liaison.find()
  expect(finalInDb).toHaveLength(1)
})

/**
 * PUT
 */
it('should return a 200 if the update was successful', async () => {
  const originalLiaison = generate.liaison({ abbreviation: 'KSA' })
  const inDb = await new Liaison(originalLiaison).save()

  const updateLiaison = generate.liaison({ abbreviation: 'KSB' })
  updateLiaison._id = inDb._id.toString()

  const res = await request(app)
    .put('/api/liaisons/')
    .send(updateLiaison)

  expect(res.status).toEqual(200)
  expect(res.body).toEqual(updateLiaison)
  const finalInDb = await Liaison.findById(res.body._id)
  expect(formatDb(finalInDb)).toMatchObject(updateLiaison)
})

it('should return a 400 if any of the fields are messed up', async () => {
  const originalLiaison = generate.liaison({ abbreviation: 'KSA' })
  const inDb = await new Liaison(originalLiaison).save()

  const updateLiaison = generate.liaison({ abbreviation: 'KSA', email: 'hi@k' })
  updateLiaison._id = inDb._id.toString()

  const res = await request(app)
    .put('/api/liaisons/')
    .send(updateLiaison)

  expect(res.status).toEqual(400)
  expect(res.body).toEqual({ message: expect.any(String) })
  const finalInDb = await Liaison.findById(inDb._id)
  expect(formatDb(finalInDb)).toMatchObject(originalLiaison)
})

it('should return a 404 if not found', async () => {
  const inDb = await Liaison.find()
  expect(inDb).toHaveLength(0)
  const updateLiaison = generate.liaison({ abbreviation: 'KSA', _id: generate.objectId() })

  const res = await request(app)
    .put('/api/liaisons/')
    .send(updateLiaison)

  expect(res.status).toEqual(404)
  expect(res.body).toEqual({})
})

/**
 * DELETE
 */
it('should return a 204 if delete was successful', async () => {
  const liaison = generate.liaison({ abbreviation: 'KSA' })
  const created = await new Liaison(liaison).save()
  const inDb = await Liaison.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).delete(`/api/liaisons/${created._id}`)

  expect(res.status).toEqual(204)
  expect(res.body).toEqual({})
  const finalInDb = await Liaison.find()
  expect(finalInDb).toHaveLength(0)
})

it('should return a 404 if not found', async () => {
  const inDb = await Liaison.find()
  expect(inDb).toHaveLength(0)

  const res = await request(app).delete(`/api/liaisons/${generate.objectId()}`)

  expect(res.status).toEqual(404)
  expect(res.body).toEqual({})
})
