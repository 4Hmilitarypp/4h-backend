import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../app'
import { ICurriculumResourceDocument } from '../../models/CurriculumResource'
import { ILesson } from '../../sharedTypes'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'curriculumResources'

const CurriculumResource = mongoose.model('CurriculumResource')

describe('curriculumResources', () => {
  /**
   * GET
   */
  it('should return a 200 if get was successful', async () => {
    const curriculumResource = generate.curriculumResource()
    await new CurriculumResource(curriculumResource).save()
    const inDb = await CurriculumResource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app).get('/api/curriculumResources')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ ...curriculumResource, _id: expect.any(String), slug: expect.any(String) }])
  })

  it('should return a 200 if getOne was successful and return lessons with the CR', async () => {
    const lesson = generate.lesson()
    const curriculumResource = generate.curriculumResource({}, lesson)
    await new CurriculumResource(curriculumResource).save()
    const inDb = await CurriculumResource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app).get(`/api/curriculumResources/${inDb[0]._id}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ...curriculumResource, _id: expect.any(String), slug: expect.any(String) })
  })

  it('should return a 200 if getOneBySlug was successful and return lessons with the CR', async () => {
    const lesson = generate.lesson()
    const curriculumResource = generate.curriculumResource({}, lesson)
    await new CurriculumResource(curriculumResource).save()
    const inDb = (await CurriculumResource.find()) as ICurriculumResourceDocument[]
    expect(inDb).toHaveLength(1)

    const slug = inDb[0].slug
    expect(slug).toBe(inDb[0].slug)

    const res = await request(app).get(`/api/curriculumResources/slug/${slug}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ...curriculumResource, _id: expect.any(String), slug: expect.any(String) })
  })

  /**
   * POST
   */
  it('should return a 201 if create was successful', async () => {
    const curriculumResource = generate.curriculumResource()

    const res = await request(app)
      .post('/api/curriculumResources')
      .send(curriculumResource)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ ...curriculumResource, _id: expect.any(String), slug: expect.any(String) })
    const inDb = await CurriculumResource.find()
    expect(formatDb(inDb[0])).toMatchObject({
      ...curriculumResource,
      _id: res.body._id,
      lessons: expect.any(Array),
      slug: res.body.slug,
    })
  })

  it('should return a 400 if a curriculumResource with a duplicate title is created', async () => {
    const curriculumResource = generate.curriculumResource({ title: 'Will be Duplicated' })
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
    const originalCurriculumResource = generate.curriculumResource()
    const inDb = await new CurriculumResource(originalCurriculumResource).save()

    const updateCurriculumResource = generate.curriculumResource({ title: 'updated title' })
    updateCurriculumResource._id = inDb._id.toString()

    const res = await request(app)
      .put('/api/curriculumResources/')
      .send(updateCurriculumResource)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(updateCurriculumResource)
    const finalInDb = await CurriculumResource.findById(res.body._id)
    expect(formatDb(finalInDb)).toMatchObject({ ...updateCurriculumResource, lessons: expect.any(Array) })
  })

  it('should return a 404 if not found', async () => {
    const inDb = await CurriculumResource.find()
    expect(inDb).toHaveLength(0)
    const updateCurriculumResource = generate.curriculumResource({ _id: generate.objectId() })

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
    const curriculumResource = generate.curriculumResource()
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
})

interface ISetupLessonArgs {
  lesson?: ILesson
}

describe('lessons', () => {
  const setupLesson = async (props: ISetupLessonArgs = {}) => {
    const generatedCurriculumResource = generate.curriculumResource({}, props.lesson)
    await new CurriculumResource(generatedCurriculumResource).save()
    const curriculumResource = (await CurriculumResource.find())[0]
    const url = `/api/curriculumResources/${curriculumResource._id}/lessons`
    return { url }
  }

  /**
   * GET
   */
  it('should return a 200 if get was successful', async () => {
    const lesson = generate.lesson()
    const { url } = await setupLesson({ lesson })
    const res = await request(app).get(url)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ ...lesson, _id: expect.any(String) }])
  })

  /**
   * POST
   */
  it('should return a 201 if create was successful', async () => {
    const lesson = generate.lesson()
    const { url } = await setupLesson()

    const res = await request(app)
      .post(url)
      .send(lesson)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ ...lesson, _id: expect.any(String) })
    expect(res.body._id).not.toBe(lesson._id)
    const inDb = (await CurriculumResource.find()) as ICurriculumResourceDocument[]
    expect(formatDb(inDb[0].lessons[0])).toMatchObject({ ...lesson, _id: res.body._id })
  })

  it('should return a 400 if a lesson is created without a title', async () => {
    const lesson = generate.lesson({ title: undefined })
    const { url } = await setupLesson()
    const inDb = (await CurriculumResource.find()) as ICurriculumResourceDocument[]
    expect(inDb[0].lessons).toHaveLength(0)

    const res = await request(app)
      .post(url)
      .send(lesson)

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ message: expect.any(String) })
    const finalInDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(finalInDb.lessons).toHaveLength(0)
  })

  /**
   * PUT
   */
  it('should return a 200 if the update was successful', async () => {
    const lesson = generate.lesson()
    const { url } = await setupLesson({ lesson })
    const inDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument

    const updateLesson = generate.lesson({ title: 'updated title' })
    updateLesson._id = (inDb.lessons[0] as any)._id.toString()

    const res = await request(app)
      .put(url)
      .send(updateLesson)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(updateLesson)
    const finalInDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(formatDb(finalInDb.lessons[0])).toMatchObject(updateLesson)
  })

  it('should return a 404 if not found', async () => {
    const { url } = await setupLesson()
    const inDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(inDb.lessons).toHaveLength(0)
    const updateLesson = generate.lesson({ _id: generate.objectId() })

    const res = await request(app)
      .put(url)
      .send(updateLesson)

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({})
  })

  /**
   * DELETE
   */
  it('should return a 204 if delete was successful', async () => {
    const createdLesson = generate.lesson()
    const { url } = await setupLesson({ lesson: createdLesson })
    const inDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(inDb.lessons).toHaveLength(1)

    const res = await request(app).delete(`${url}/${createdLesson._id}`)

    expect(res.status).toEqual(204)
    expect(res.body).toEqual({})
    const finalInDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(finalInDb.lessons).toHaveLength(0)
  })

  it('should return a 404 if not found', async () => {
    const { url } = await setupLesson()
    const inDb = (await CurriculumResource.findOne()) as ICurriculumResourceDocument
    expect(inDb.lessons).toHaveLength(0)

    const res = await request(app).delete(`${url}/${generate.objectId()}`)

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({})
  })
})
