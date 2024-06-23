const dbConnection = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");

// Function to handle posting a new question
async function postQuestion(req, res) {
  const { tittle, description, tag } = req.body;

  // Generate a unique question ID
  const questionid = uuidv4();

  // Check if required fields are provided
  if (!tittle || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required information!" });
  }

  try {
    // Insert  into the database
    const result = await dbConnection.query(
      "INSERT INTO questions (questionid, userid, tittle, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, req.user.userid, tittle, description, tag]
    );

    // 
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "your question has posted", questionid });
  } catch (error) {
    console.log(error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "Question ID already exists" });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

// Function to handle  a specific question by its ID
async function getQuestion(req, res) {
  // Extract the question ID from request parameters
  const { questionid } = req.params;

  try {

    const [question] = await dbConnection.query(
      "SELECT tittle, description , username, users.username ,questionid  from questions join users on  users.userid = questions.userid  where questionid = ?  ",
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    // Return the found question
    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error("Error retrieving question:", error.message);

   
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

// Function to handle all questions
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(
      
      "SELECT q.questionid, q.tittle, u.username FROM questions q JOIN users u ON q.userid = u.userid"
    );

    // Return the list of questions
    return res.status(StatusCodes.OK).json(questions);
  } catch (error) {
    console.error("Error retrieving questions:", error.message);

    //
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}
/// delete function
async function deleteQuestion(req, res) {
  const userid = req.user.userid;
  const questionid = req.params.questionid;
  
  
  try {
    
      await dbConnection.query("DELETE FROM answers WHERE questionid = ?", [
        questionid,
      ]).then(async ()=>{
        const [result] = await dbConnection.query(
        "DELETE FROM questions WHERE questionid = ?",
        [questionid]
      );
      
      if (result.affectedRows > 0){
    // alert("Question deleted successfully");
    return res.status(200).json({ msg: "Question deleted successfully" });}
    else {
      return res.status(404).json({ msg: "not found" });
    }
      })
      
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

/// search question

 async function search(req,res){
   const { stringQuery } = req.body;
   try {
     const [rows] = await dbConnection.query(
       "SELECT * FROM questions WHERE tittle LIKE ?",
       [`%${stringQuery}%`]
     );
     res.json(rows);
   } catch (error) {
     console.error("Error fetching search results:", error);
     res.status(500).json({ msg: "Something went wrong" });
   }
  }
  /// update question
  async function updateQuestion(req, res) {
    const { tittle, description } = req.body;
    const questionid = req.params.questionIdOnEdit;
    console.log("answerid ===>", questionid);
    console.log("questionid ===>", questionid); // Debug log
    console.log("tittle ===>", tittle); // Debug log
    console.log("description ===>", description); // Debug log
    // Check if required information is provided
    if (!tittle || !description) {
      return res
        .status(400)
        .json({ msg: "Please provide all required information" });
    }

    try {
      // update the answer into the database
      const result = await dbConnection.query(
        "UPDATE  questions SET tittle = (?), description = (?) WHERE questionid = (?) ",
        [tittle, description, questionid]
      );

      return res.status(201).json({ msg: "Your question has been updated " });
    } catch (error) {
      console.error("Error updating question:", error.message);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
module.exports = {
  postQuestion,
  getQuestion,
  getAllQuestions,
  deleteQuestion,
  search,
  updateQuestion,
};
