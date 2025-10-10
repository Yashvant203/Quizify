const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const QuizModel = require('../models/Quiz');
const Question = require('../models/Question');
const { auth, adminOnly } = require('../middleware/auth');

// Submit attempt - server calculates score
router.post('/', auth, async (req, res) => {
  const { quizId, answers /* [{ questionId, selected }] */, timeTakenSeconds } = req.body;
  if (!quizId || !Array.isArray(answers)) return res.status(400).json({ message: 'Invalid payload' });

  const quiz = await QuizModel.findById(quizId).populate('questionIds');
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  const questionDocs = await Question.find({ _id: { $in: answers.map(a => a.questionId) } });
  const answerMap = {};
  questionDocs.forEach(q => { answerMap[q._id.toString()] = q; });

  let score = 0;
  const processed = answers.map(a => {
    const q = answerMap[a.questionId];
    const isCorrect = q && typeof q.correctOptionIndex === 'number' && q.correctOptionIndex === a.selected;
    if (isCorrect) score += 1;
    return { questionId: a.questionId, selected: a.selected, isCorrect };
  });

  const result = new Result({ quizId, userId: req.user._id, answers: processed, score, total: answers.length, timeTakenSeconds });
  await result.save();
  res.json(result);
});

// Get user's results
router.get('/me', auth, async (req, res) => {
  const results = await Result.find({ userId: req.user._id }).populate('quizId', 'title');
  res.json(results);
});

// Get a specific result (owner or admin)
router.get('/:id', auth, async (req, res) => {
  const result = await Result.findById(req.params.id).populate('quizId', 'title description');
  if (!result) return res.status(404).json({ message: 'Not found' });
  if (result.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  // populate question texts
  const qIds = result.answers.map(a => a.questionId);
  const qs = await Question.find({ _id: { $in: qIds } });
  const map = {};
  qs.forEach(q => { map[q._id.toString()] = q; });

  const enhanced = result.toObject();
  enhanced.answers = enhanced.answers.map(a => ({ ...a, questionText: map[a.questionId]?.text }));
  res.json(enhanced);
});

// Analytics: average score and attempts per quiz (admin only)
router.get('/analytics/all', auth, adminOnly, async (req, res) => {
  const pipeline = [
    { $group: { _id: '$quizId', attempts: { $sum: 1 }, avgScore: { $avg: { $multiply: [{ $divide: ['$score', '$total'] }, 100] } } } },
    { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
    { $unwind: '$quiz' },
    { $project: { quizId: '$_id', title: '$quiz.title', attempts: 1, avgScore: { $round: ['$avgScore', 1] } } }
  ];
  const agg = await Result.aggregate(pipeline);
  res.json(agg);
});

// Admin: all results
router.get('/', auth, adminOnly, async (req, res) => {
  const results = await Result.find().populate('quizId userId');
  res.json(results);
});

module.exports = router;
