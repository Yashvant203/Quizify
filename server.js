const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// connect DB
connectDB();

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));-+

// simple health check
app.get('/', (req, res) => res.send('Exam Quiz Backend is running'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Seed a demo user for development convenience
if (process.env.NODE_ENV !== 'production') {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  (async () => {
    try {
      const demoEmail = process.env.DEMO_EMAIL || 'demo@example.com';
      const demoPassword = process.env.DEMO_PASSWORD || 'demoPass123';
      let demo = await User.findOne({ email: demoEmail });
      if (!demo) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(demoPassword, salt);
        demo = new User({ name: 'Demo User', email: demoEmail, password: hash, role: 'student' });
        await demo.save();
        console.log(`Seeded demo user: ${demoEmail} / ${demoPassword}`);
      } else {
        console.log(`Demo user already exists: ${demoEmail}`);
      }
    } catch (err) {
      console.error('Error seeding demo user', err.message);
    }
  })();
}

// Seed sample questions and quizzes (development only)
if (process.env.NODE_ENV !== 'production') {
  const Question = require('./models/Question');
  const Quiz = require('./models/Quiz');
  (async () => {
    try {
      // remove any legacy quiz named exactly 'Math Quiz 1'
      await Quiz.deleteOne({ title: 'Math Quiz 1' });

      const count = await Quiz.countDocuments();
      if (count >= 10) {
        console.log('Quizzes already seeded');
        return;
      }

      // create diverse sample questions across subjects
      const subjects = [
        { key: 'science', title: 'General Science' },
        { key: 'history', title: 'World History' },
        { key: 'geography', title: 'Geography' },
        { key: 'english', title: 'English' },
        { key: 'cs', title: 'Computer Science' },
        { key: 'physics', title: 'Physics' },
        { key: 'chemistry', title: 'Chemistry' },
        { key: 'biology', title: 'Biology' },
        { key: 'economics', title: 'Economics' },
        { key: 'art', title: 'Art & Culture' },
      ];

      const sampleQuestions = [];
      subjects.forEach((s, si) => {
        // 3 questions per subject
        for (let j = 1; j <= 3; j++) {
          const qnum = si * 3 + j;
          sampleQuestions.push({
            text: `${s.title} Q${j}: Sample question ${qnum} about ${s.title}?`,
            options: [
              `Option A for ${s.key} ${qnum}`,
              `Option B for ${s.key} ${qnum}`,
              `Option C for ${s.key} ${qnum}`,
              `Option D for ${s.key} ${qnum}`,
            ],
            correctOptionIndex: 1,
            tags: ['sample', s.key],
            explanation: `This is a sample explanation for ${s.title} question ${j}`,
          });
        }
      });

      const createdQuestions = await Question.insertMany(sampleQuestions);
      console.log(`Seeded ${createdQuestions.length} questions across ${subjects.length} subjects`);

      // create 10 quizzes, one per subject
      const quizzes = subjects.map((s, idx) => {
        const selected = createdQuestions.slice(idx*3, idx*3 + 3).map(d => d._id);
        return {
          title: `${s.title} Quiz`,
          description: `A short ${s.title} quiz to test basic ${s.title.toLowerCase()} knowledge.`,
          questionIds: selected,
          timeLimitMinutes: 10 + idx,
          isPublished: true,
        };
      });

      const createdQuizzes = await Quiz.insertMany(quizzes);
      console.log(`Seeded ${createdQuizzes.length} quizzes across multiple subjects`);
    } catch (err) {
      console.error('Error seeding quizzes', err.message);
    }
  })();
}
