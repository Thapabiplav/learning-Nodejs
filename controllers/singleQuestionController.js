const { questions, users, answers } = require("../model");

exports.renderSingleQuestionPage = async (req, res) => {
  const { id } = req.params;
  const data = await questions.findAll({
    where: {
      id: id,
    },
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });

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

  res.render("questions/singleQuestion", { data, answers:answerData });
};
