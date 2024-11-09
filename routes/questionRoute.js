const {
  renderAskQuestionPage,
  askQuestion,
} = require("../controllers/questionController");
const {
  renderSingleQuestionPage,
} = require("../controllers/singleQuestionController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router();
const { multer, storage } = require("../middleware/multerConfig");
const upload = multer({ storage: storage });

router
  .route("/askquestion")
  .get(isAuthenticated, renderAskQuestionPage)
  .post(isAuthenticated, upload.single("image"), askQuestion);
router.route("/question/:id").get(renderSingleQuestionPage);

module.exports = router;
