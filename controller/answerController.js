const dbConnection = require("../db/dbConfig");

async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
 const userid = req.user.userid;
  // Check if required information is provided
  if ( !questionid || !answer) {
    return res
      .status(400)
      .json({ msg: "Please provide all required information" });
  }

  try {
    //  const { questionid } = req.params;
    const questionid = req.params.questionid;
    // Insert the answer into the database
    const result = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );


    return res.status(201).json({ msg: "Your answer has been posted" });
  } catch (error) {
    console.error("Error posting answer:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

async function getAnswer(req, res) {
  const { questionid } = req.params;

  try {
    // Query the database to get answers for the specified question
    const [answers] = await dbConnection.query(
      "SELECT answers.answer , users.username , answers.answerid FROM answers INNER JOIN users ON answers.userid = users.userid WHERE questionid =?",
      [questionid]
    );

   console.log(answers)
    return res.status(200).send( answers );
  } catch (error) {
    console.error("Error retrieving answers:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

// async function deleteAnswer(req, res) {
//   // const userid = req.user.userid;
//   console.log("delete answer");
//   const questionid = req.params.questionid;
//   const { answerid } = req.params.answerid;
//   const {userid} = req.user
//   console.log("answerid===> ", answerid);
//   console.log("questionid===> ", questionid);
//   try {
    

//     const [selectAnswer] = await dbConnection.query(
//       'SELECT userid FROM answers  WHERE questionid = ?',
//       [questionid]
//     );
//     const [result] = await dbConnection.query(
//       "DELETE FROM answers WHERE questionid = ? AND answerid=?",
//       [questionid, answerid]
//     );

//     if (result.affectedRows > 0) {
//       // alert("Question deleted successfully");
//       return res.status(200).json({ msg: "answer deleted successfully" });
//     } else {
//       return res.status(404).json({ msg: "not found" });
//     }
//     // })
//   } catch (error) {
//     console.error("Error deleting answer:", error);
//     return res.status(500).json({ msg: "Something went wrong" });
//   }
// }
async function deleteAnswer(req, res) {
  console.log("delete answer");
  
  const answerid = req.params.answerid; // Corrected extraction of answerid
  const userid = req.user.userid; // Corrected extraction of userid

  console.log("answerid===> ", answerid);
  // console.log("questionid===> ", questionid);

  try {
    // Check if the answer exists and if the user is the owner
    const [selectAnswer] = await dbConnection.query(
      "SELECT userid FROM answers WHERE  answerid = ?",
      [ answerid]
    );

    if (selectAnswer.length === 0) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    const answerOwnerId = selectAnswer[0].userid;

    if (answerOwnerId !== userid) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this answer" });
    }

    // Proceed with deleting the answer
    const [result] = await dbConnection.query(
      "DELETE FROM answers WHERE answerid = ?",
      [ answerid]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ msg: "Answer deleted successfully" });
    } else {
      return res.status(404).json({ msg: "Answer not found" });
    }
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

async function updateAnswer(req, res) {
  const {  answer } = req.body;
 const answerid = req.params.answerIdOnEdit;
//  console.log("answerid ===>", answerid)
  // Check if required information is provided
  if ( !answer) {
    return res
      .status(400)
      .json({ msg: "Please provide all required information" });
  }

  try {
    
    // update the answer into the database
    const result = await dbConnection.query(
      "UPDATE  answers SET answer = (?) WHERE answerid = (?) ",
      [answer, answerid]
    );

    return res.status(201).json({ msg: "Your answer has been updated " });
  } catch (error) {
    console.error("Error updating answer:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}
module.exports = { postAnswer, getAnswer, deleteAnswer, updateAnswer };
