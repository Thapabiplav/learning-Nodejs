const { questions, users } = require("../model")
const {cloudinary}=require('../cloudinary/index')
exports.renderAskQuestionPage = (req,res)=>{
    res.render("questions/askQuestion")
}

exports.askQuestion = async (req,res)=>{

    const {title,description}  = req.body 
    // console.log(req.body)
    // console.log(req.file)
    const userId = req.userId 
    const fileName = req.file.filename
      const result=await cloudinary.v2.uploader.upload(req.file.path)
    if(!title || !description ){
        return res.send("Please provide title, description")
    }
    await questions.create({
        title, 
        description, 
        image : result.url,
        userId
    })
    res.redirect("/")
}

exports.getAllQuestion = async (req,res)=>{
    const data = await questions.findAll({
        include : [
            {
                model : users
            }
        ]
    })
}