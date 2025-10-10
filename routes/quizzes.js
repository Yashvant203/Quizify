const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { auth, adminOnly } = require('../middleware/auth');

// List published quizzes (admins see all)
router.get('/', auth, async (req, res) => {
  const quizzes = await Quiz.find(req.user.role === 'admin' ? {} : { isPublished: true }).populate('createdBy', 'name email');
  res.json(quizzes);
});

// Create (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  const quiz = new Quiz({ ...req.body, createdBy: req.user._id });
  await quiz.save();
  res.json(quiz);
});

// Get quiz details
router.get('/:id', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questionIds');
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  res.json(quiz);
});

// Start an attempt (returns questions without answers)
router.post('/:id/start', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questionIds');
  if (!quiz || (!quiz.isPublished && req.user.role !== 'admin')) return res.status(404).json({ message: 'Quiz not available' });
  // Do not include correct answers
  const payload = quiz.questionIds.map(q => ({ id: q._id, text: q.text, options: q.options }));
  // include title and description to help frontend show subject name
  res.json({ quizId: quiz._id, title: quiz.title, description: quiz.description, timeLimitMinutes: quiz.timeLimitMinutes, questions: payload });
});

// Edit / delete routes (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  const q = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
});
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
