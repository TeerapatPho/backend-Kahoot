const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Answer = new Schema({
  value: String,
})

const Question = new Schema({
  type: {
    type: String,
    enum: ['Choices', 'True-False', 'Short Answer']
  },
  question: String,
  choices: [Answer],
  answer: Answer,
})

const Quiz = new Schema({
  quiz_name: String,
  questions: [Question],
  no_session: Number,
  updated_on: Number,
  owner_id: String,
  tag: { type: Schema.Types.ObjectId, ref: 'RelatedQuizzes' },
  disabled: { type: Boolean, default: false },
  createdAt: Date,
})

const RelatedQuiz = new Schema({
  quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quizzes' }]
})

const QuizModel = mongoose.model("Quizzes", Quiz);
const RelatedQuizModel = mongoose.model("RelatedQuizzes", RelatedQuiz);

module.exports = {
  QuizModel,
  RelatedQuizModel
}