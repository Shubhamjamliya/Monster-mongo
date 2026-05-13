const mongoose = require('mongoose');

const TransferLogSchema = new mongoose.Schema({
  sourceDb: String,
  destinationDb: String,
  dbName: String,
  collections: [String],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  transferredRecords: {
    type: Number,
    default: 0
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('TransferLog', TransferLogSchema);
