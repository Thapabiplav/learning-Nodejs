const nodemailer =require('nodemailer')

const sendEmail=async(data)=>{
  const transprter=nodemailer.createTransport({
    service:'email',
    auth:{
      user:'',
      pass:''
    }
  })
  const mailOption ={
    from:"",
    to:data.email,
    subject:data.subject,
    text:data.text
  }
  await transprter.sendMail(mailOption)
}
module.exports=sendEmail