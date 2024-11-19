const { QueryTypes } = require("sequelize");
const { questions, users, answers, sequelize } = require("../model");

exports.renderSingleQuestionPage = async (req, res) => {
  const { id } = req.params;
  const data = await questions.findAll({
    where: {
      id: id,
    },
    include: [ //table join 
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });

  let likes;
  let count=0;
  try {
     likes= await sequelize.query(`SELECT * FROM  likes_${id}`,{
      type:QueryTypes.SELECT
    })
     count=likes.length
  } catch (error) {
    console.log(error);
    
  }

  

  const answerData = await answers.findAll({
    where: {
      questionId: id,
    },
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });

  res.render("questions/singleQuestion", { data, answers:answerData,likes:count });
}