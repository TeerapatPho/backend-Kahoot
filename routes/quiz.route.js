const express = require('express');
const { getAllQuiz, getOneQuiz, createQuiz, updateQuiz, getByTagQuiz, deleteQuiz } = require('../controllers/quiz.controller');
const router = express.Router()

// get all quiz
router.get('/', getAllQuiz);

// get specific quiz
router.get('/:quiz_id', getOneQuiz);

// get quiz by tag
router.get('/tag/:tag_id', getByTagQuiz);

// create quiz
router.post('/', createQuiz);

// update quiz
router.put('/:quiz_id', updateQuiz)

// delete quiz
router.delete('/:quiz_id', deleteQuiz)

module.exports = router;