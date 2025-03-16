import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
let port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
let mean = 5.91666666667;
let stdDev = 2.46644143116;

let questions = [
  {
    id: '1',
    question: "'mhm' \n Select the most rizzful response to the message.",
    options: [
      'Is this thing on? 🎤',
      'What brand is your microwave?',
      "Where'd you get that? that beautiful smile",
      'you are NOT fine enough to be acting like that',
    ],
    answer: 3,
  },
  {
    id: '2',
    question: 'Select the most rizzful opening message.',
    options: [
      'Hello, I think you are very pretty. Can I get your snap?',
      'i saw your profile and thought you were cute, can i get your snap?',
      'hey wsg shawty, tryna slide that snap?',
      'YOU ARE SOOO HOTTT',
    ],
    answer: 1,
  },
  {
    id: '3',
    question:
      "'heyyyyyyyyy' \n Select the most rizzful response to the message.",
    options: ['heyyyyyyyyyy', 'Hi', 'Hello', 'hey wsp'],
    answer: 3,
  },
  {
    id: '4',
    question:
      "'Why weren't you responding?' \n Select the most rizzful response to the message.",
    options: [
      'I was hanging out with sarah, wyd?',
      'I was programming',
      'I was sleeping',
      'I was at the gym',
    ],
    answer: 0,
  },
  {
    id: '5',
    question:
      "'Wyd today?' \n Select the most rizzful response to the message.",
    options: [
      'i went to the gym and hung out with friends, wbu?',
      'not much',
      'i made a user authentication script with nodejs and mongo',
      'not much, wbu',
    ],
    answer: 0,
  },
  {
    id: '6',
    question:
      'The person you are rizzing takes a day to respond. \n What should you do?',
    options: [
      'Respond Immediatly',
      'Leave her on delivered for a day',
      'Leaver her on read',
      'Go do something and respond when you feel like it',
    ],
    answer: 3,
  },
  {
    id: '7',
    question:
      'The person you are rizzing is with friends. \n How should you rizz them?',
    options: [
      'Make an excuse to join the conversation and talk to everyone',
      'Never rizz when someone is in a group',
      'Start a conversation with them and ignore the friends',
      'Start talking to their friends and then talk to everyone together',
    ],
    answer: 3,
  },
  {
    id: '8',
    question:
      "The person you are rizzing says they don't like you. \n What is the best response?",
    options: [
      'No worries, got any cute friends?',
      'no worries, is your friend single btw?',
      'ok',
      'I know, no one ever does',
    ],
    answer: 1,
  },
  {
    id: '9',
    question:
      'The person you are rizzing is leaving you on read \n What should you do?',
    options: [
      'Text again so they get the notification and remember',
      'Repost a tiktok about your crush not responding',
      'move on and text the other huzz, you can restart the convo a week from now',
      'call them',
    ],
    answer: 2,
  },
  {
    id: '10',
    question:
      'You have class with the person you want to rizz \n How should you rizz them?',
    options: [
      'Find an excuse to get their phone number that could be excused as friendly',
      'Tell them you like them and ask for their number',
      'Get their number from their friend',
      'Wait for them to talk to you',
    ],
    answer: 0,
  },
  {
    id: '11',
    question:
      'You are talking to the huzz about your life. \n What is the most rizzful way to do so?',
    options: [
      'Tell about all of your hobbies and why you like them. Your family etc.',
      'Provide small snipets of your life out of context',
      "Say you don't do much",
      'Talk a lot about the hobby or thing you like most',
    ],
    answer: 1,
  },
  {
    id: '12',
    question: 'How do you get with someone out of your league?',
    options: [
      "You don't",
      'Gaslight them',
      'There is no such thing as leagues',
      'Try way harder than the people in their league',
    ],
    answer: 2,
  },
];

// async function setQuestions() {
//   try {
//     const data = await fs.readFile('./questions.json', 'utf8');
//     questions = JSON.parse(data);
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

// setQuestions();

// Queue to hold write operations
const writeQueue = [];

// Flag to indicate if the queue is currently being processed
let isProcessing = false;

// Function to process the write queue
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (writeQueue.length > 0) {
    const { filePath, data, resolve, reject } = writeQueue.shift();
    try {
      let oldData = await fs.readFile(filePath);
      let json = JSON.parse(oldData);
      json.push(JSON.parse(data));
      let stuffToWrite = JSON.stringify(json);
      fs.writeFile(filePath, stuffToWrite); // Append mode
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  isProcessing = false;
}

// Function to add a write operation to the queue
function queueWriteOperation(filePath, data) {
  new Promise((resolve, reject) => {
    writeQueue.push({ filePath, data, resolve, reject });
    processQueue();
  })
    .then(() => console.log('Write successful'))
    .catch((error) => console.error('Write failed', error));
}

app.get('/questions', (req, res) => {
  let questionsToSend = questions.map((item) => {
    delete item.answer; // Removes the 'age' attribute
    return item; // Return the modified object
  });
  res.json(questionsToSend);
});

app.post('/answers', async (req, res) => {
  let { answers } = req.body;
  queueWriteOperation('responses.json', JSON.stringify(answers) + '\n');
  res.send(JSON.stringify({ message: 'norming' }));
  // res.send(
  //   JSON.stringify({
  //     rizzq: await calculateRizzQ(answers),
  //   })
  // );
});

let correctAnswers = [
  {
    id: '1',
    question: "'mhm' \n Select the most rizzful response to the message.",
    options: [
      'Is this thing on? 🎤',
      'What brand is your microwave?',
      "Where'd you get that? that beautiful smile",
      'you are NOT fine enough to be acting like that',
    ],
    answer: 3,
  },
  {
    id: '2',
    question: 'Select the most rizzful opening message.',
    options: [
      'Hello, I think you are very pretty. Can I get your snap?',
      'i saw your profile and thought you were cute, can i get your snap?',
      'hey wsg shawty, tryna slide that snap?',
      'YOU ARE SOOO HOTTT',
    ],
    answer: 1,
  },
  {
    id: '3',
    question:
      "'heyyyyyyyyy' \n Select the most rizzful response to the message.",
    options: ['heyyyyyyyyyy', 'Hi', 'Hello', 'hey wsp'],
    answer: 3,
  },
  {
    id: '4',
    question:
      "'Why weren't you responding?' \n Select the most rizzful response to the message.",
    options: [
      'I was hanging out with sarah, wyd?',
      'I was programming',
      'I was sleeping',
      'I was at the gym',
    ],
    answer: 0,
  },
  {
    id: '5',
    question:
      "'Wyd today?' \n Select the most rizzful response to the message.",
    options: [
      'i went to the gym and hung out with friends, wbu?',
      'not much',
      'i made a user authentication script with nodejs and mongo',
      'not much, wbu',
    ],
    answer: 0,
  },
  {
    id: '6',
    question:
      'The person you are rizzing takes a day to respond. \n What should you do?',
    options: [
      'Respond Immediatly',
      'Leave her on delivered for a day',
      'Leaver her on read',
      'Go do something and respond when you feel like it',
    ],
    answer: 3,
  },
  {
    id: '7',
    question:
      'The person you are rizzing is with friends. \n How should you rizz them?',
    options: [
      'Make an excuse to join the conversation and talk to everyone',
      'Never rizz when someone is in a group',
      'Start a conversation with them and ignore the friends',
      'Start talking to their friends and then talk to everyone together',
    ],
    answer: 3,
  },
  {
    id: '8',
    question:
      "The person you are rizzing says they don't like you. \n What is the best response?",
    options: [
      'No worries, got any cute friends?',
      'no worries, is your friend single btw?',
      'ok',
      'I know, no one ever does',
    ],
    answer: 1,
  },
  {
    id: '9',
    question:
      'The person you are rizzing is leaving you on read \n What should you do?',
    options: [
      'Text again so they get the notification and remember',
      'Repost a tiktok about your crush not responding',
      'move on and text the other huzz, you can restart the convo a week from now',
      'call them',
    ],
    answer: 2,
  },
  {
    id: '10',
    question:
      'You have class with the person you want to rizz \n How should you rizz them?',
    options: [
      'Find an excuse to get their phone number that could be excused as friendly',
      'Tell them you like them and ask for their number',
      'Get their number from their friend',
      'Wait for them to talk to you',
    ],
    answer: 0,
  },
  {
    id: '11',
    question:
      'You are talking to the huzz about your life. \n What is the most rizzful way to do so?',
    options: [
      'Tell about all of your hobbies and why you like them. Your family etc.',
      'Provide small snipets of your life out of context',
      "Say you don't do much",
      'Talk a lot about the hobby or thing you like most',
    ],
    answer: 1,
  },
  {
    id: '12',
    question: 'How do you get with someone out of your league?',
    options: [
      "You don't",
      'Gaslight them',
      'There is no such thing as leagues',
      'Try way harder than the people in their league',
    ],
    answer: 2,
  },
];

async function calculateRizzQ(answers) {
  const userAnswerMap = answers.reduce((acc, { id, answer }) => {
    acc[id] = answer;
    return acc;
  }, {});
  console.log(userAnswerMap);
  console.log(questions);

  let score = correctAnswers.reduce((acc, q) => {
    return userAnswerMap[q.id] === q.answer ? 1 + acc : acc;
  }, 0);
  console.log(score);
  let rizzq = Math.round(100 + 15 * ((score - mean) / stdDev));
  return rizzq;
}

app.listen(port, () => {
  console.log('running on ' + port);
});
