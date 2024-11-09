const express = require("express");
const app = express();

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { renderHomePage } = require("./controllers/authController");
const cookieParser = require("cookie-parser");

require("./model/index");
// const app = require("express")()
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute=require('./routes/answerRoute')

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  const token = req.cookies.jwtToken;
 try {
    const decryptedResult = await promisify(jwt.verify)(token, "hahaha");
    if (decryptedResult) {
      res.locals.isAuthenticated = true;
    } else {
      res.locals.isAuthenticated = false;
    }
 } catch (error) {
    res.locals.isAuthenticated=false
 }
  next();
});

app.get("/", renderHomePage);

app.use("/", authRoute);
app.use("/", questionRoute);
app.use('/answer',answerRoute)


app.use(express.static("public/css/"));
app.use(express.static('storage/'))

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Project has started at port ${PORT}`);
});
