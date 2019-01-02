import mongoose, { Document } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify'
import { ICurriculumResource, ILesson, Omit } from '../sharedTypes'

export interface ICurriculumResourceDocument extends Omit<ICurriculumResource, '_id'>, Document {
  lessons: ILesson[]
}

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
  category: String,
  docUrl: String,
  externalUrl: String,
  pdfUrl: String,
  pptUrl: String,
  title: {
    required: 'lesson title is required',
    type: String,
  },
})

const curriculumResource = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  featuredImage: featuredImageSchema,
  lessons: [lessonSchema],
  slug: String,
  title: {
    required: 'title is required',
    type: String,
    unique: true,
  },
})

curriculumResource.plugin(uniqueValidator, { message: 'Error, expected value `{VALUE}` at `{PATH}` to be unique.' })

curriculumResource.pre('save', function(this: ICurriculumResourceDocument, next) {
  if (!this.isModified('title')) {
    next()
    return
  }
  this.slug = slugify(this.title)
  next()
})

curriculumResource.pre('findOneAndUpdate', function(next) {
  const title = this.getUpdate().title
  if (title) {
    ;(this as any)._update.slug = slugify(title)
    next()
  } else {
    next()
    return
  }
})

export default mongoose.model<ICurriculumResourceDocument>(
  'CurriculumResource',
  curriculumResource,
  'curriculumResources'
)
