const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Result = new Schema({
  answer: String,
  correct: String,
  time_usage: Number
})

const Player = new Schema({
  user_id: String,
  results: [Result]
})

const Room = new Schema({
  room_status: { type: String, enum: ['waiting', 'started', 'terminated'] },
  room_pin: String,
  start_time: Date,
  end_time: Date,
  max_player: Number,
  quiz: { type: Schema.Types.ObjectId, ref: 'Quizzes' },
  players: [Player],
  time_limit: Number,
})

module.exports = mongoose.model("Rooms", Room);