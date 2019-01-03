import mongoose from 'mongoose'
import slugify from 'slugify'
import request from 'supertest'
import app from '../../app'
import { IResourceDocument } from '../../models/Resource'
import { ILesson } from '../../sharedTypes'
import generate from '../../utils/generate'
import { formatDb } from '../../utils/object'

process.env.TEST_SUITE = 'resources'

const Resource = mongoose.model('Resource')

describe('resources', () => {
  /**
   * GET
   */
  it('should return a 200 if get was successful', async () => {
    const resource = generate.resource()
    await new Resource(resource).save()
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app).get('/api/resources')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ ...resource, _id: expect.any(String), slug: expect.any(String) }])
  })

  it('should return a 200 if getOne was successful and return lessons with the CR', async () => {
    const lesson = generate.lesson()
    const resource = generate.resource({}, lesson)
    await new Resource(resource).save()
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app).get(`/api/resources/${inDb[0]._id}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ...resource, _id: expect.any(String), slug: expect.any(String) })
  })

  it('should return a 200 if getOneBySlug was successful and return lessons with the CR', async () => {
    const lesson = generate.lesson()
    const resource = generate.resource({}, lesson)
    await new Resource(resource).save()
    const inDb = (await Resource.find()) as IResourceDocument[]
    expect(inDb).toHaveLength(1)

    const slug = inDb[0].slug
    expect(slug).toBe(inDb[0].slug)

    const res = await request(app).get(`/api/resources/slug/${slug}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ...resource, _id: expect.any(String), slug: expect.any(String) })
  })

  /**
   * POST
   */
  it('should return a 201 if create was successful', async () => {
    const resource = generate.resource()

    const res = await request(app)
      .post('/api/resources')
      .send(resource)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ ...resource, _id: expect.any(String), slug: expect.any(String) })
    const inDb = await Resource.find()
    expect(formatDb(inDb[0])).toMatchObject({
      ...resource,
      _id: res.body._id,
      lessons: expect.any(Array),
      slug: res.body.slug,
    })
  })

  it('should return a 400 if a resource with a duplicate title is created', async () => {
    const resource = generate.resource({ title: 'Will be Duplicated' })
    await new Resource(resource).save()
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app)
      .post('/api/resources')
      .send(resource)

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ message: expect.any(String) })
    const finalInDb = await Resource.find()
    expect(finalInDb).toHaveLength(1)
  })

  /**
   * PUT
   */
  it('should return a 200 if the update was successful and slug should still be title', async () => {
    const originalResource = generate.resource()
    const inDb = (await new Resource(originalResource).save()) as IResourceDocument

    const updateResource = generate.resource({ title: 'updated title' })
    updateResource._id = inDb._id.toString()

    const res = await request(app)
      .put('/api/resources/')
      .send(updateResource)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ ...updateResource, slug: expect.any(String) })
    const finalInDb = (await Resource.findById(res.body._id)) as IResourceDocument
    expect(formatDb(finalInDb)).toMatchObject({
      ...updateResource,
      lessons: expect.any(Array),
      slug: slugify(finalInDb.title),
    })
  })

  it('should return a 404 if not found', async () => {
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(0)
    const updateResource = generate.resource({ _id: generate.objectId() })

    const res = await request(app)
      .put('/api/resources/')
      .send(updateResource)

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({})
  })

  /**
   * DELETE
   */
  it('should return a 204 if delete was successful', async () => {
    const resource = generate.resource()
    const created = await new Resource(resource).save()
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(1)

    const res = await request(app).delete(`/api/resources/${created._id}`)

    expect(res.status).toEqual(204)
    expect(res.body).toEqual({})
    const finalInDb = await Resource.find()
    expect(finalInDb).toHaveLength(0)
  })

  it('should return a 404 if not found', async () => {
    const inDb = await Resource.find()
    expect(inDb).toHaveLength(0)

    const res = await request(app).delete(`/api/resources/${generate.objectId()}`)

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({})
  })
})

interface ISetupLessonArgs {
  lesson?: ILesson
}

describe('lessons', () => {
  const setupLesson = async (props: ISetupLessonArgs = {}) => {
    const generatedResource = generate.resource({}, props.lesson)
    await new Resource(generatedResource).save()
    const resource = (await Resource.find())[0]
    const url = `/api/resources/${resource._id}/lessons`
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
    const inDb = (await Resource.find()) as IResourceDocument[]
    expect(formatDb(inDb[0].lessons[0])).toMatchObject({ ...lesson, _id: res.body._id })
  })

  it('should return a 400 if a lesson is created without a title', async () => {
    const lesson = generate.lesson({ title: undefined })
    const { url } = await setupLesson()
    const inDb = (await Resource.find()) as IResourceDocument[]
    expect(inDb[0].lessons).toHaveLength(0)

    const res = await request(app)
      .post(url)
      .send(lesson)

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ message: expect.any(String) })
    const finalInDb = (await Resource.findOne()) as IResourceDocument
    expect(finalInDb.lessons).toHaveLength(0)
  })

  /**
   * PUT
   */
  it('should return a 200 if the update was successful', async () => {
    const lesson = generate.lesson()
    const { url } = await setupLesson({ lesson })
    const inDb = (await Resource.findOne()) as IResourceDocument

    const updateLesson = generate.lesson({ title: 'updated title' })
    updateLesson._id = (inDb.lessons[0] as any)._id.toString()

    const res = await request(app)
      .put(url)
      .send(updateLesson)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(updateLesson)
    const finalInDb = (await Resource.findOne()) as IResourceDocument
    expect(formatDb(finalInDb.lessons[0])).toMatchObject(updateLesson)
  })

  it('should return a 404 if not found', async () => {
    const { url } = await setupLesson()
    const inDb = (await Resource.findOne()) as IResourceDocument
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
    const inDb = (await Resource.findOne()) as IResourceDocument
    expect(inDb.lessons).toHaveLength(1)

    const res = await request(app).delete(`${url}/${createdLesson._id}`)

    expect(res.status).toEqual(204)
    expect(res.body).toEqual({})
    const finalInDb = (await Resource.findOne()) as IResourceDocument
    expect(finalInDb.lessons).toHaveLength(0)
  })

  it('should return a 404 if not found', async () => {
    const { url } = await setupLesson()
    const inDb = (await Resource.findOne()) as IResourceDocument
    expect(inDb.lessons).toHaveLength(0)

    const res = await request(app).delete(`${url}/${generate.objectId()}`)

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({})
  })
})
