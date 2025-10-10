const mongoose = require('mongoose');
const connectDB = require('../config/db');
// Ensure models are registered
require('../models/Question');
require('../models/Quiz');
const Quiz = require('../models/Quiz');

(async () => {
  try {
    await connectDB();
    const quizzes = await Quiz.find().populate('questionIds');
    console.log(`Found ${quizzes.length} quizzes`);
    quizzes.forEach((q, i) => {
      console.log(`${i+1}. ${q.title} - ${q.questionIds.length} questions`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
