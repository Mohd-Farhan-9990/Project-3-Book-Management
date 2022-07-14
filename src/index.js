const express = require('express')
const route  = require("./routes/route")
const {default:mongoose} = require('mongoose')
const bodyParser = require('body-parser')
const app =express()
const multer = require('multer')
const{AppConfig} = require('aws-sdk')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer().any())

const url = "mongodb+srv://MohdFarhan9990:LxP62162nUtlmSsp@cluster0.1zhmxfg.mongodb.net/group43Database"

mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log("MongoDB Is Connected"))
.catch(err=>console.log(err.message))

app.use('/',route)

app.listen(process.env.PORT || 3000,function(){
    console.log("Express app is running on PORT "+(process.env.PORT||3000))
})