import mongoose from 'mongoose'

const archiveSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    liaison: {
      type: Object,
    },
    research: {
      type: Object,
    },
  },
  { strict: false }
)

export default mongoose.model('Archive', archiveSchema)
