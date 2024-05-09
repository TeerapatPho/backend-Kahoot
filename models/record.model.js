const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Result = new Schema({
  answer: String,
  correct: Boolean,
  time_usage: Number
})

const Player = new Schema({
  user_id: String,
  results: [Result]
})

const Record = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quizzes' },
  players: [Player],
})

module.exports = mongoose.model("Records", Record);