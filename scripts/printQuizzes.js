const connectDB = require('../config/db');

(async () => {
  try {
    await connectDB();
  require('../models/Question');
  const Quiz = require('../models/Quiz');
    const quizzes = await Quiz.find({ title: { $in: [
      'General Science Quiz','World History Quiz','Geography Quiz','English Quiz','Computer Science Quiz','Physics Quiz','Chemistry Quiz','Biology Quiz','Economics Quiz','Art & Culture Quiz'
    ] } }).populate('questionIds');

    for (const qz of quizzes) {
      console.log(`\n=== ${qz.title} ===`);
      qz.questionIds.forEach((q, i) => {
        console.log(`Q${i+1}: ${q.text}`);
        q.options.forEach((opt, idx) => console.log(`  ${String.fromCharCode(65+idx)}. ${opt}`));
        console.log(`  Correct: ${String.fromCharCode(65 + (q.correctOptionIndex || 0))}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
