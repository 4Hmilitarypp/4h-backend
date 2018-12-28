import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../app'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'curriculumResources'

const CurriculumResource = mongoose.model('CurriculumResource')

/**
 * GET
 */
it('should return a 200 if get was successful', async () => {
  const curriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })
  await new CurriculumResource(curriculumResource).save()
  const inDb = await CurriculumResource.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).get('/api/curriculumResources')
  expect(res.status).toBe(200)
  expect(res.body).toEqual([{ ...curriculumResource, _id: expect.any(String) }])
})

/**
 * POST
 */
it('should return a 201 if created was successful', async () => {
  const curriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })

  const res = await request(app)
    .post('/api/curriculumResources')
    .send(curriculumResource)

  expect(res.status).toBe(201)
  expect(res.body).toEqual({ ...curriculumResource, _id: expect.any(String) })
  const inDb = await CurriculumResource.find()
  expect(formatDb(inDb[0])).toMatchObject(curriculumResource)
})

it('should return a 400 if a curriculumResource with a duplicate abbreviation is created', async () => {
  const curriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })
  await new CurriculumResource(curriculumResource).save()
  const inDb = await CurriculumResource.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app)
    .post('/api/curriculumResources')
    .send(curriculumResource)

  expect(res.status).toEqual(400)
  expect(res.body).toEqual({ message: expect.any(String) })
  const finalInDb = await CurriculumResource.find()
  expect(finalInDb).toHaveLength(1)
})

/**
 * PUT
 */
it('should return a 200 if the update was successful', async () => {
  const originalCurriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })
  const inDb = await new CurriculumResource(originalCurriculumResource).save()

  const updateCurriculumResource = generate.curriculumResource({ abbreviation: 'KSB' })
  updateCurriculumResource._id = inDb._id.toString()

  const res = await request(app)
    .put('/api/curriculumResources/')
    .send(updateCurriculumResource)

  expect(res.status).toEqual(200)
  expect(res.body).toEqual(updateCurriculumResource)
  const finalInDb = await CurriculumResource.findById(res.body._id)
  expect(formatDb(finalInDb)).toMatchObject(updateCurriculumResource)
})

it('should return a 400 if any of the fields are messed up', async () => {
  const originalCurriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })
  const inDb = await new CurriculumResource(originalCurriculumResource).save()

  const updateCurriculumResource = generate.curriculumResource({ abbreviation: 'KSA', email: 'hi@k' })
  updateCurriculumResource._id = inDb._id.toString()

  const res = await request(app)
    .put('/api/curriculumResources/')
    .send(updateCurriculumResource)

  expect(res.status).toEqual(400)
  expect(res.body).toEqual({ message: expect.any(String) })
  const finalInDb = await CurriculumResource.findById(inDb._id)
  expect(formatDb(finalInDb)).toMatchObject(originalCurriculumResource)
})

it('should return a 404 if not found', async () => {
  const inDb = await CurriculumResource.find()
  expect(inDb).toHaveLength(0)
  const updateCurriculumResource = generate.curriculumResource({ abbreviation: 'KSA', _id: generate.objectId() })

  const res = await request(app)
    .put('/api/curriculumResources/')
    .send(updateCurriculumResource)

  expect(res.status).toEqual(404)
  expect(res.body).toEqual({})
})

/**
 * DELETE
 */
it('should return a 204 if delete was successful', async () => {
  const curriculumResource = generate.curriculumResource({ abbreviation: 'KSA' })
  const created = await new CurriculumResource(curriculumResource).save()
  const inDb = await CurriculumResource.find()
  expect(inDb).toHaveLength(1)

  const res = await request(app).delete(`/api/curriculumResources/${created._id}`)

  expect(res.status).toEqual(204)
  expect(res.body).toEqual({})
  const finalInDb = await CurriculumResource.find()
  expect(finalInDb).toHaveLength(0)
})

it('should return a 404 if not found', async () => {
  const inDb = await CurriculumResource.find()
  expect(inDb).toHaveLength(0)

  const res = await request(app).delete(`/api/curriculumResources/${generate.objectId()}`)

  expect(res.status).toEqual(404)
  expect(res.body).toEqual({})
})
