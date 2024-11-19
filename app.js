const express = require("express");
const app = express();

const socketio = require("socket.io");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { renderHomePage } = require("./controllers/authController");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

require("./model/index");
// const app = require("express")()
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");
const catchError = require("./util/catchError");
const { answers, sequelize } = require("./model/index");
const { QueryTypes } = require("sequelize");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(flash());

app.use(
  session({
    secret: "thisissecretforsession",
    resave: false,
    saveUninitialized: false,
  })
);

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
    res.locals.isAuthenticated = false;
  }
  next();
});

app.get("/", catchError(renderHomePage));

app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/answer", answerRoute);

app.use(express.static("public/css/"));
app.use(express.static("storage/"));

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Project has started at port ${PORT}`);
});

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("like", async ({ answerId, cookie }) => {
    const answer = await answers.findByPk(answerId);
    if (answer && cookie) {
      const decryptedResult = await promisify(jwt.verify)(cookie, "hahaha");
      if (decryptedResult) {
        const user= await sequelize.query(`SELECT * FROM likes_${answerId} WHERE userId=${decryptedResult.id}`,{
          type:QueryTypes.SELECT
        })
        if(user.length==0){
          await sequelize.query(
            `INSERT INTO likes_${answerId} (userId) VALUES (${decryptedResult.id})`,
            {
              type: QueryTypes.INSERT,
            }
          );
        }
        
      }
      const likes = await sequelize.query(`SELECT * FROM likes_${answerId}`, {
        type: QueryTypes.SELECT,
      });

     
      const likesCount = likes.length;
      await answers.update({
        likes:likesCount
      },{
        where:{
          id:answerId
        }
      })

      socket.emit("likeUpdate", { likesCount, answerId });
    }
  });
});
