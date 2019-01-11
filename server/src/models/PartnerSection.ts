import mongoose from 'mongoose'
import slugify from 'slugify'

const partnerSectionSchema = new mongoose.Schema({
  featuredImages: { type: Array, required: 'Please enter a a featured image' },
  shortDescription: { type: String, required: 'Please enter a description' },
  slug: String,
  title: { type: String, required: 'Please enter a title' },
})

partnerSectionSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    next()
    return
  }
  ;(this as any).slug = slugify((this as any).title)
  next()
})

partnerSectionSchema.pre('findOneAndUpdate', function(next) {
  const title = this.getUpdate().title
  if (title) {
    ;(this as any)._update.slug = slugify(title)
    next()
  } else {
    next()
    return
  }
})

export default mongoose.model('PartnerSection', partnerSectionSchema)
