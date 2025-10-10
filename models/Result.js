const { Schema, model } = require('mongoose');

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  selected: { type: Number },
  isCorrect: { type: Boolean }
});

const resultSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  score: { type: Number },
  total: { type: Number },
  timeTakenSeconds: { type: Number },
}, { timestamps: true });

module.exports = model('Result', resultSchema);
