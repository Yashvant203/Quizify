const connectDB = require('../config/db');
const Quiz = require('../models/Quiz');

(async () => {
  try {
    await connectDB();
    const subjects = [
      'General Science Quiz',
      'World History Quiz',
      'Geography Quiz',
      'English Quiz',
      'Computer Science Quiz',
      'Physics Quiz',
      'Chemistry Quiz',
      'Biology Quiz',
      'Economics Quiz',
      'Art & Culture Quiz',
    ];

    const quizzes = await Quiz.find().limit(10);
    for (let i = 0; i < quizzes.length && i < subjects.length; i++) {
      quizzes[i].title = subjects[i];
      await quizzes[i].save();
      console.log(`Renamed quiz ${i+1} to ${subjects[i]}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
