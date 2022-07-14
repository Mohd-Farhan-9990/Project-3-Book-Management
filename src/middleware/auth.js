
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");

///////////////////////////////////// Authentication ///////////////////////////////////////////////

const authentication = async function (req, res, next) {
    try {
        // let userId = req.body.userId;
        // let user = await userModel.findById({ _id: userId })
        // if (!user) {
        //     return res.status(404).send({ status: false, msg: "No such user exist" })
        // }

        let token = req.headers["x-api-key"]
        if (!token) token = req.headers["X-API-KEY"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "token not found" })
        }

        let decodedtoken = jwt.verify(token, "Project-3-Group-43")
        if (!decodedtoken) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }
        req.userId = decodedtoken.userId;


        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

///////////////////////////////  Authorisation  /////////////////////////////////////

const authorisation = function (req, res, next) {

    try {
        let token = req.headers["x-api-key"]
        if(!token)token = req.headers["X-API-KEY"]
        let decodedtoken = jwt.verify(token, "Project-3-Group-43")
        let userId = req.body.userId;
        if (decodedtoken.userId != userId) {
            return res.status(403).send({ status: false, msg: "you are not authorise" })
        }

        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }

}

//======================================================Auhotrisation By Book Id ======================================

const authorisationbyBId = async function(req,res,next){
    let bookId = req.params.bookId
    
    if(!bookId){
       return res.status(400).send({status: false, message: "Please enter a book ID."});
    }
    if(!mongoose.isValidObjectId(bookId)){
       return res.status(400).send({status: false, message: 'Invalid book id'});
    }

    let bookData = await bookModel.findById({_id:bookId,isDeleted:false})
    if(!bookData){
        return res.status(404).send({status: false, message: 'No Book exists with that id or Might be Deleted'});
    }
    
    if(bookData.userId.toString() !== req.userId){
    return res.status(403).send({status: false, message: 'Unauthorized access'});
    }
    
    next()
}

//exporting functions
module.exports = { authentication, authorisation, authorisationbyBId }