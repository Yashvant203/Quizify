const fs = require('fs');
const connectDB = require('../config/db');

(async () => {
  try {
    await connectDB();
    const User = require('../models/User');
    const Question = require('../models/Question');
    const Quiz = require('../models/Quiz');
    const Result = require('../models/Result');

    const users = await User.find().lean();
    const questions = await Question.find().lean();
    const quizzes = await Quiz.find().lean();
    const results = await Result.find().lean();

    fs.writeFileSync('export_users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('export_questions.json', JSON.stringify(questions, null, 2));
    fs.writeFileSync('export_quizzes.json', JSON.stringify(quizzes, null, 2));
    fs.writeFileSync('export_results.json', JSON.stringify(results, null, 2));

    console.log('Exported collections to JSON files');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
