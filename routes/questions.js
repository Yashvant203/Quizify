const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth, adminOnly } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// List / filter
router.get('/', auth, async (req, res) => {
  const { tag, search, limit = 50 } = req.query;
  const filter = {};
  if (tag) filter.tags = tag;
  if (search) filter.text = { $regex: search, $options: 'i' };
  const questions = await Question.find(filter).limit(Number(limit));
  res.json(questions);
});

// Create (admin)
router.post('/', auth, adminOnly, [ body('text').notEmpty() ], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const q = new Question({ ...req.body, createdBy: req.user._id });
  await q.save();
  res.json(q);
});

// Edit
router.put('/:id', auth, adminOnly, async (req, res) => {
  const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
});

// Delete
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
