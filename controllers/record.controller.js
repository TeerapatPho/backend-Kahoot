const { QuizModel } = require('../models/quiz.model');
const RecordModel = require('../models/record.model')

const getAllRecord = async (req, res) => {
  const user_id = req.user_id;

  try {
    const records = await RecordModel.find({ players: { $elemMatch: { user_id: user_id } }, disabled: false })
      .populate('quiz')
      .exec();
    return res.status(200).json({
      success: true,
      found: records.length,
      records: records,
    })
  } catch (error) {
    console.error("Error on retrieving records:", error);
    return res.status(500).json({ success: false, message: "Error on retrieving records" });
  }
}

const getOneRecord = async (req, res) => {
  try {
    const record = await RecordModel.findOne({
      _id: req.params.record_id,
    })
      .populate('quiz')
      .exec();

    return res.status(200).json({
      success: true,
      record: record,
    })
  } catch (error) {
    console.error("Error on retrieving record:", error);
    return res.status(500).json({ success: false, message: "Error on retrieving record" });
  }
}

const appendRecord = async (req, res) => {
  const data = req.body.data;

  try {
    const record = await RecordModel.findOne({ quiz: req.params.quiz_id, disabled: false }).exec();

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const players = record.players;

    for (let i = 0; i < players.length; i++) {
      if (players[i].user_id === req.user_id) {
        players[i].results = data.results;
        break;
      }
    }

    await record.save();

    await QuizModel.findByIdAndUpdate(req.params.quiz_id, { using: true });

    return res.status(200).json({
      success: true,
      record: record,
    });
  } catch (error) {
    console.error("Error while creating record:", error);
    return res.status(500).json({ success: false, message: "Error while creating record" });
  }
}

const deleteMyRecord = async (req, res) => {
  
  try {
    const record = await RecordModel.findOne({_id: req.params.quiz_id }).exec();

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    record.players = record.players.filter(player => player.user_id != req.user_id);

    await record.save()

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error on removing records:", error);
    return res.status(500).json({ success: false, message: "Error on removing records" });
  }
};

module.exports = {
  getAllRecord,
  getOneRecord,
  appendRecord,
  deleteMyRecord,
}