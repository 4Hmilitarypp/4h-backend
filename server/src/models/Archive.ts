import mongoose from 'mongoose'

const archiveSchema = new mongoose.Schema(
  {
    liaison: {
      type: Object,
    },
  },
  { strict: false }
)

export default mongoose.model('Archive', archiveSchema)
