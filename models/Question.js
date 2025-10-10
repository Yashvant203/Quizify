const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  // For single-choice quizzes use correctOptionIndex (Number).
  correctOptionIndex: { type: Number },
  tags: [{ type: String }],
  explanation: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = model('Question', questionSchema);
