import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

// @ts-ignore: validate causing whole schema to error
const researchSchema = new mongoose.Schema({
  description: {
    required: 'description is required',
    type: String,
  },
  title: {
    required: 'title is required',
    type: String,
    unique: true,
  },
  type: { required: 'type is required', type: String, enum: ['doc', 'pdf', 'link'] },
  url: {
    required: 'url is required',
    type: String,
  },
})

researchSchema.plugin(uniqueValidator)

export default mongoose.model('Research', researchSchema)
