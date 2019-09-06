import mongoose from 'mongoose'
import { I4HDocument, IArchive } from '../sharedTypes';

export interface IArchiveDocument extends IArchive, I4HDocument { }

const archiveSchema = new mongoose.Schema({
  archivedAt: { type: Date, default: Date.now },
  archivedBy: String,
  record: Object,
  type: String,
})

export default mongoose.model('Archive', archiveSchema)
