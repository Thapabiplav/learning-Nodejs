const { handleRegister, renderRegisterPage, renderLoginPage, handleLogin, renderForgetPassword, handleForgetPassword, renderVerifyOtpPage, handleVerifyOtp, renderResetPassword, handleResetPassword, handleLogout } = require("../controllers/authController")

const router = require("express").Router()

router.route('/logout').get(handleLogout)
router.route('/register').post(handleRegister).get(renderRegisterPage)
router.route("/login").get(renderLoginPage).post(handleLogin)
router.route('/forgotPassword').get(renderForgetPassword).post(handleForgetPassword)
router.route('/verifyOtp').get(renderVerifyOtpPage)
router.route('/verifyOtp/:id').post(handleVerifyOtp)
router.route('/resetPassword').get(renderResetPassword)
router.route('/resetPassword/:email/:otp').post(handleResetPassword)

module.exports = router 