const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({origin: "http://backend-app:3000", credentials: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

async function main() {
  await mongoose.connect(`mongodb://${process.env.DB_URI}/${process.env.DB_Name}`);

  const QuizModel = require('./models/quiz.model')
  const RoomModel = require('./models/room.model')

  app.get("/", (req, res) => {
    res.status(200).send("connected backend successfully!");
  });

  const { verifyFirebaseToken } = require('./middlewares/auth.middleware');
  const quizRouter = require('./routes/quiz.route');
  const roomRouter = require('./routes/room.route');

  app.use('/api/quizzes', verifyFirebaseToken, quizRouter);
  app.use('/api/rooms', roomRouter);

  app.listen(3000, () => {
    console.log("connecting to port: 3000");
  });
}

main().catch(err => console.log(err));

