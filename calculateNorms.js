import fs from 'fs/promises';
let userAnswers;
async function setUserAnswers() {
  try {
    const data = await fs.readFile('./responses.json', 'utf8');
    userAnswers = JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

setUserAnswers();
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

setTimeout(() => {
  const userScores = userAnswers.map((user) => {
    const userAnswerMap = user.reduce((acc, { id, answer }) => {
      acc[id] = answer;
      return acc;
    }, {});

    return correctAnswers.reduce((acc, q) => {
      return userAnswerMap[q.id] === q.answer ? 1 + acc : acc;
    }, 0);
  });

  console.log(userScores);
}, 100);
