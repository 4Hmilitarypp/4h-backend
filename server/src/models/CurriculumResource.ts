import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const featuredImageSchema = new mongoose.Schema({
  _id: { auto: false },
  alt: {
    required: 'image description is required',
    type: String,
  },
  url: {
    required: 'image url is required',
    type: String,
  },
})

const lessonSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  docUrl: {
    type: String,
  },
  externalUrl: {
    type: String,
  },
  pdfUrl: {
    type: String,
  },
  pptUrl: {
    type: String,
  },
  title: {
    required: 'lesson title is required',
    type: String,
    unique: true,
  },
})

const curriculumResource = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  featuredImage: featuredImageSchema,
  lessons: {
    type: [lessonSchema],
    validate: {
      message: 'at least one lesson is required',
      validator: (v: any) => v === null || v.length > 0,
    },
  },
  title: {
    required: 'title is required',
    type: String,
    unique: true,
  },
})

curriculumResource.plugin(uniqueValidator, { message: 'Error, expected value `{VALUE}` at `{PATH}` to be unique.' })

export default mongoose.model('CurriculumResource', curriculumResource, 'curriculumResources')
