import mongoose from 'mongoose'

const partnerSchema = new mongoose.Schema({
  annualReports: { type: Array },
  featuredImages: { type: Array, required: 'Please submit at least one featured image' },
  images: Array,
  links: Array,
  longDescription: { type: String, required: 'Please enter a long description' },
  shortDescription: { type: String, required: 'Please enter a short description' },
  slug: String,
  title: { type: String, required: 'Please enter a title' },
  videoReports: Array,
})

export default mongoose.model('Partner', partnerSchema)
