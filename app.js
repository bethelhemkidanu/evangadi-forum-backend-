require('dotenv').config()
const express = require('express');
const app = express();
const port = 5500

const cors = require('cors')
app.use(cors())
// db connection
const dbConnection = require('./db/dbConfig')
// user routes middleware  file

const userRoutes = require("./routes/userRoute")

// question routes middleware  file
const questionsRoute = require("./routes/QuestionRoute")
// answer routes middleware  file
const answersRoute = require("./routes/answerRoute")


// authentication middleware file
const authMiddleware = require("./middleware/authMiddleware");

// json middleware to extract  json data 
app.use(express.json())
//  user routes middleware
app.use("/api/users" , userRoutes);

//  questions routes middleware
app.use("/api/questions", authMiddleware, questionsRoute);

// answers routes middleware
app.use("/api/answers", authMiddleware, answersRoute);




async function start(){
  try {
  const result = await dbConnection.execute("select 'test'")
  app.listen(port)
  console.log("database connection etablished")
  console.log(`listening on ${port}`)

} catch (error) {
  console.log(error.message)
}
}
start()

