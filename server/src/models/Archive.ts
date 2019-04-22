import mongoose from 'mongoose'

const archiveSchema = new mongoose.Schema({
  archivedAt: { type: Date, default: Date.now },
  archivedBy: String,
  record: {
    type: Object,
  },
  type: String,
})

export default mongoose.model('Archive', archiveSchema)
