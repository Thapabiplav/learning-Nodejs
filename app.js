const express = require('express')
const { users } = require('./model/index')
const app = express()

const { renderHomePage, renderRegisterPage, handleRegister, renderLoginPage } = require('./controllers/authController')
const cookieParser = require('cookie-parser')

require("./model/index")
// const app = require("express")()
const authRoute  = require("./routes/authRoute")
const questionRoute = require("./routes/questionRoute")


app.set('view engine','ejs')
app.use(express.urlencoded({extended : true})) 
app.use(express.json()) 
app.use(cookieParser())

app.get('/',renderHomePage)


app.use("/",authRoute)
app.use("/",questionRoute)


app.use(express.static('public/css/'))

const PORT = 4000
app.listen(PORT,()=>{
    console.log(`Project has started at port ${PORT}`)
})

