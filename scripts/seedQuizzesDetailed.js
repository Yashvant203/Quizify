const connectDB = require('../config/db');
const mongoose = require('mongoose');

(async () => {
  try {
    await connectDB();
    // require models
    const Question = require('../models/Question');
    const Quiz = require('../models/Quiz');
    const User = require('../models/User');

    // Remove existing subject quizzes we manage
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

    await Quiz.deleteMany({ title: { $in: subjects } });

    // Optionally remove questions created by this seeder (tagged 'seed')
    await Question.deleteMany({ tags: 'seed' });

    const data = {
      'General Science Quiz': [
        { text: 'Which gas is most abundant in the Earth\'s atmosphere?', options: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], correct:1 },
        { text: 'What is the chemical symbol for water?', options: ['WO','H2O','O2H','HO2'], correct:1 },
        { text: 'Which organ in the human body pumps blood?', options: ['Liver','Lungs','Heart','Kidney'], correct:2 },
      ],
      'World History Quiz': [
        { text: 'Who was the first Emperor of Rome?', options: ['Julius Caesar','Augustus','Nero','Caligula'], correct:1 },
        { text: 'In which year did World War II end?', options: ['1940','1945','1939','1950'], correct:1 },
        { text: 'The Great Wall is located in which country?', options: ['India','China','Japan','Mongolia'], correct:1 },
      ],
      'Geography Quiz': [
        { text: 'Which is the largest ocean on Earth?', options: ['Atlantic','Indian','Arctic','Pacific'], correct:3 },
        { text: 'Which country has the city of Cairo?', options: ['Egypt','Morocco','Algeria','Tunisia'], correct:0 },
        { text: 'Mount Everest is part of which mountain range?', options: ['Andes','Rockies','Himalayas','Alps'], correct:2 },
      ],
      'English Quiz': [
        { text: 'What is the antonym of "ancient"?', options: ['old','modern','archaic','aged'], correct:1 },
        { text: 'Which is a noun in this sentence: "The cat slept."?', options: ['The','cat','slept','none'], correct:1 },
        { text: 'Choose the correct past tense of "go".', options: ['goed','went','gone','goes'], correct:1 },
      ],
      'Computer Science Quiz': [
        { text: 'What does CPU stand for?', options: ['Central Process Unit','Central Processing Unit','Computer Personal Unit','Control Processing Unit'], correct:1 },
        { text: 'Which data structure uses FIFO order?', options: ['Stack','Queue','Tree','Graph'], correct:1 },
        { text: 'HTML is primarily used for?', options: ['Styling','Structure of web pages','Server-side logic','Database queries'], correct:1 },
      ],
      'Physics Quiz': [
        { text: 'What is the SI unit of force?', options: ['Newton','Joule','Watt','Pascal'], correct:0 },
        { text: 'Sound travels fastest in which medium?', options: ['Air','Vacuum','Water','Solids'], correct:3 },
        { text: 'What is acceleration due to gravity on Earth (approx)?', options: ['9.8 m/s^2','1 m/s^2','98 m/s^2','0.98 m/s^2'], correct:0 },
      ],
      'Chemistry Quiz': [
        { text: 'pH value of 7 indicates?', options: ['Acidic','Neutral','Basic','Alkaline'], correct:1 },
        { text: 'Table salt is chemically known as?', options: ['Sodium Chloride','Potassium Chloride','Calcium Carbonate','Sodium Bicarbonate'], correct:0 },
        { text: 'Which element has atomic number 1?', options: ['Helium','Hydrogen','Oxygen','Carbon'], correct:1 },
      ],
      'Biology Quiz': [
        { text: 'Photosynthesis primarily occurs in which part of a plant?', options: ['Root','Stem','Leaf','Flower'], correct:2 },
        { text: 'Which blood cells help fight infections?', options: ['Red blood cells','Platelets','White blood cells','Plasma'], correct:2 },
        { text: 'DNA stands for?', options: ['Deoxyribonucleic Acid','Deoxy RNA Acid','Ribonucleic Acid','Deoxyribo Acid'], correct:0 },
      ],
      'Economics Quiz': [
        { text: 'GDP stands for?', options: ['Gross Domestic Product','General Domestic Product','Gross Domestic Price','General Domestic Price'], correct:0 },
        { text: 'Inflation means?', options: ['Price stability','General rise in prices','Decrease in prices','No change in prices'], correct:1 },
        { text: 'Which is a monetary policy tool?', options: ['Taxation','Open market operations','Subsidies','Budget allocation'], correct:1 },
      ],
      'Art & Culture Quiz': [
        { text: 'The Mona Lisa was painted by?', options: ['Van Gogh','Picasso','Leonardo da Vinci','Rembrandt'], correct:2 },
        { text: 'The traditional Japanese theater is called?', options: ['Kabuki','Ballet','Opera','Salsa'], correct:0 },
        { text: 'Which instrument is a string instrument?', options: ['Flute','Violin','Trumpet','Timpani'], correct:1 },
      ],
    };

    // Optionally associate quizzes with demo user if exists
    const demoUser = await User.findOne({ email: process.env.DEMO_EMAIL || 'demo@example.com' });
    const createdQuizzes = [];

    for (const [title, qs] of Object.entries(data)) {
      const qDocs = [];
      for (const q of qs) {
        const doc = new Question({
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correct,
          tags: ['seed'],
          explanation: q.explanation || '',
        });
        await doc.save();
        qDocs.push(doc._id);
      }

      const quiz = new Quiz({
        title,
        description: `A short ${title} to test fundamental knowledge.`,
        questionIds: qDocs,
        timeLimitMinutes: 10,
        isPublished: true,
        createdBy: demoUser ? demoUser._id : undefined,
      });
      await quiz.save();
      createdQuizzes.push(quiz);
      console.log(`Created quiz: ${title}`);
    }

    console.log(`Seeded ${createdQuizzes.length} detailed quizzes`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
