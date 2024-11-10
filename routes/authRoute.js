const { handleRegister, renderRegisterPage, renderLoginPage, handleLogin, renderForgetPassword, handleForgetPassword } = require("../controllers/authController")

const router = require("express").Router()


router.route('/register').post(handleRegister).get(renderRegisterPage)
router.route("/login").get(renderLoginPage).post(handleLogin)
router.route('/forgotPassword').get(renderForgetPassword).post(handleForgetPassword)



module.exports = router 