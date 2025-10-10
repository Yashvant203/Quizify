const { Schema, model } = require('mongoose');

const quizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  timeLimitMinutes: { type: Number, default: 15 },
  isPublished: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = model('Quiz', quizSchema);
