import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
let port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
let mean = 1;
let stdDev = 0.831209414594;

let questions;

async function setQuestions() {
  try {
    const data = await fs.readFile('./questions.json', 'utf8');
    questions = JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

setQuestions();

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

let correctAnswers;

async function setCorrectAnswers() {
  try {
    const data = await fs.readFile('./questions.json', 'utf8');
    correctAnswers = JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

setCorrectAnswers();

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
