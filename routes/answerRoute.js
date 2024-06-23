const express = require("express");
const router = express.Router();

const {
  postAnswer,
  getAnswer,
  deleteAnswer,
  updateAnswer,
} = require("../controller/answerController");

// Route for posting answers to a specific question
router.post("/all-answer/:questionid", postAnswer);



// GET request to retrieve answers for a specific question
router.get("/all-answer/:questionid", getAnswer);

// delete 
// router.delete("/all-answer/:questionid/:answerid", deleteAnswer );

router.delete("/answer/:answerid", deleteAnswer);
// update
router.post("/update-answer/:answerIdOnEdit", updateAnswer);


module.exports = router;
