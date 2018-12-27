import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

// @ts-ignore: validate causing whole schema to error
const curriculumResource = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  featuredImage: {
    alt: {
      required: 'image description is required',
      type: String,
    },
    url: {
      required: 'image url is required',
      type: String,
    },
  },
  resources: [
    {
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
      powerpointUrl: {
        type: String,
      },
      title: {
        required: 'title is required',
        type: String,
        unique: true,
      },
    },
  ],
  title: {
    required: 'title is required',
    type: String,
    unique: true,
  },
})

curriculumResource.plugin(uniqueValidator)

export default mongoose.model('CurriculumResource', curriculumResource)
