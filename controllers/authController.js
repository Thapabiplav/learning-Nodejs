const { users, questions } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../util/sendEmail");
exports.renderHomePage = async (req, res) => {
  const data = await questions.findAll({
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });
  res.render("home.ejs", { data });
};

exports.renderRegisterPage = (req, res) => {
  res.render("auth/register");
};

exports.renderLoginPage = (req, res) => {
  const [error] = req.flash("error");
  res.render("auth/login", { error });
};

exports.handleRegister = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.send("Please provide username,email,password");
  }

  // await sendEmail({
  //     email:email,
  //     text:"Thank you for registering",
  //     subject:"Welcome to Project"
  // })

  await users.create({
    email,
    password: bcrypt.hashSync(password, 10),
    username,
  });

  res.redirect("/login");
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide email,password");
  }

  const [data] = await users.findAll({
    where: {
      email: email,
    },
  });
  if (data) {
    const isMatched = bcrypt.compareSync(password, data.password);
    if (isMatched) {
      const token = jwt.sign({ id: data.id }, "hahaha", {
        expiresIn: "30d",
      });
      res.cookie("jwtToken", token);
      res.redirect("/");
    } else {
      req.flash("error", "Invalid password or email");
      res.redirect("/login");
    }
  } else {
    res.send("No user with that email");
  }
};

exports.renderForgetPassword = (req, res) => {
  res.render("./auth/forgetPassword");
};

exports.handleForgetPassword = async (req, res) => {
  const { email } = req.body;
  const data = await users.findAll({
    where: {
      email: email,
    },
  });
  if (data.length === 0) return res.send("No user registered with that email");
  const otp = Math.floor(Math.random() * 1000) + 9999;
  await sendEmail({
    email: email,
    subject: "Your reset password OTP",
    text: `Your otp is ${otp}`,
  });
  data[0].otp = otp;
  data[0].otpGeneratedTime = Date.now();
  await data[0].save();
  res.redirect("/otpPage?email=" + email);
};

exports.renderVerifyOtpPage = (req, res) => {
  const email = req.query.email;
  res.render("./auth/verifyOtp", { email: email });
};

exports.handleVerifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.id;
  await users.findAll({
    where: {
      email: email,
      otp: otp,
    },
  });
  if (data.length === 0) {
    return res.send("Invalid Otp");
  }
  const currentTime = Date.now();
  const otpGeneratedTime = data[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 12000) {
    res.redirect(`/restPassword?email ${email} & otp:{otp}`);
  } else {
    res.send("Otp Expired");
  }
};

exports.renderResetPassword = async (req, res) => {
  const { email, otp } = req.query;
  if (!email || !otp) {
    return res.send("Please provide email and otp");
  }
  res.render("auth/resetPassword", { email, otp });
};

exports.handleResetPassword = async (req, res) => {
  const { email, otp } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.send("please provide email, otp, newPassword, confirmPassword");
  }

  if (newPassword !== confirmPassword) {
    return res.send("New password must match confirm password");
  }

  const userData = await users.findAll({
    where: {
      email,
      otp,
    },
  });

  const currentTime = Date.now();
  const otpGeneratedTime = data[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    await users.update(
      {
        password: bcrypt.hashSync(newPassword, 8),
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.redirect("/login");
  } else {
    res.send("otpExpired");
  }
};

exports.handleLogout=(req,res)=>{
    res.clearCookie('jwtToken')
    res.redirect('/login')
}
