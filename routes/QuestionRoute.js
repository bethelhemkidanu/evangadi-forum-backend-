// QuestionRoute.js
const express = require("express");
const router = express.Router();
const {
  postQuestion,
  getQuestion,
  getAllQuestions,
  deleteQuestion,
  search,
  updateQuestion,
} = require("../controller/questionController");
const { updateAnswer } = require("../controller/answerController");


// POST request to create a new question
router.post("/question", postQuestion);

// GET request to get a specific question
router.get("/question/:questionid", getQuestion);

// GET request to get all questions
router.get("/all-questions", getAllQuestions);
// delete question
router.delete("/delete/:questionid", deleteQuestion);
// search 
router.post("/quesearch", search);
// update question
router.post("/update-question/:questionIdOnEdit", updateQuestion)

module.exports = router;
