const { QuizModel, RelatedQuizModel } = require('../models/quiz.model');
const RecordModel = require('../models/record.model');

const getAllQuiz = async (req, res) => {
  const quizzes = await QuizModel.find({ owner_id: req.user_id, disabled: false });

  return res.status(200).json({
    success: true,
    found: quizzes.length,
    quizzes: quizzes,
  });
};

const getOneQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.findOne({ _id: req.params.quiz_id, owner_id: req.user_id }).exec();
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({ success: true, quiz: quiz });
  } catch (error) {
    console.error("Error on retrieving quiz:", error);
    return res.status(500).json({ success: false, message: "Error on retrieving quiz" });
  }
};

const getByTagQuiz = async (req, res) => {
  try {
    const tag_obj = await RelatedQuizModel
      .findOne({ _id: req.params.tag_id })
      .populate('quizzes')
      .exec();
    
    if (!tag_obj) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    return res.status(200).json({ success: true, found: tag_obj.quizzes.length, tag_obj: tag_obj });
  } catch (error) {
    console.error("Error on retrieving quiz:", error);
    return res.status(500).json({ success: false, message: "Error on retrieving quiz" });
  }
};

const createQuiz = async (req, res) => {
  const data = req.body.data;
 
  try {
    const quiz = await QuizModel.findOne({ quiz_name: data.quiz_name, owner_id: req.user_id, disabled: false }).exec();
    
    if (quiz) {
      return res.status(404).json({ success: false, message: "There is already exist quiz name" });
    }
  } catch (error) {
    console.error("Error on retrieving quiz:", error);
    return res.status(500).json({ success: false, message: "Error on retrieving quiz" });
  }

  const tag_obj = await RelatedQuizModel.create({quizzes: []});

  const quiz_data = {
    quiz_name: data.quiz_name,
    questions: [],
    using: false,
    owner_id: req.user_id,
    tag: tag_obj._id,
    disabled: false,
    createdAt: new Date(),
    time_limit: 60,
  }

  const quiz = await QuizModel.create(quiz_data);

  tag_obj.quizzes.push(quiz._id);
  await tag_obj.save();

  const record_obj = await RecordModel.create({quiz: quiz._id, players: []});

  return res.status(200).json({
    success: true,
    quiz: quiz,
  });
};
 
const updateQuiz = async (req, res) => {
  const data = req.body.data;

  try {
    const quiz = await QuizModel.findOne({ _id: req.params.quiz_id, owner_id: req.user_id, disabled: false }).exec();
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.using) {
      quiz.disabled = true;
      quiz.save();

      const quiz_data = {
        quiz_name: data.quiz.quiz_name,
        questions: data.quiz.questions,
        using: false,
        owner_id: quiz.owner_id,
        tag: quiz.tag,
        disabled: false,
        createdAt: quiz.createdAt,
        time_limit: data.time_limit,
      }

      const new_quiz = await QuizModel.create(quiz_data);

      const tag_obj = await RelatedQuizModel.findById(quiz.tag);
      
      tag_obj.quizzes.push(new_quiz._id);
      await tag_obj.save();

      const new_record = await RecordModel.create({quiz: new_quiz._id, players: []});

      return res.status(200).json({
        success: true,
        quiz: new_quiz,
      });
    } else {
      quiz.quiz_name = data.quiz.quiz_name
      quiz.questions = data.quiz.questions
      quiz.time_limit = data.quiz.time_limit

      await quiz.save();

      return res.status(200).json({
        success: true,
        quiz: quiz,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Error occured" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.findOne({_id: req.params.quiz_id, disabled: false }).exec();

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const tag_obj = await RelatedQuizModel.findById(quiz.tag).exec();

    const { deletedCount } = await QuizModel.deleteMany({
      _id: {$in: tag_obj.quizzes},
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    
    const result = await tag_obj.deleteOne().exec();

    await RecordModel.deleteMany({quiz: req.params.quiz_id}).exec();

    return res.status(200).json({
      success: true,
      tag: tag_obj._id,
      result: result,
    });
  } catch (error) {
    console.error("Error on removing quiz:", error);
    return res.status(500).json({ success: false, message: "Error on removing quiz" });
  }
};

module.exports = {
  getAllQuiz,
  getOneQuiz,
  getByTagQuiz, 
  createQuiz,
  updateQuiz,
  deleteQuiz,
}