const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'], default: 'New' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Lead', leadSchema);

