const bookModel = require("../models/bookModel")
const mongoose = require('mongoose')

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

module.exports = {authorisationbyBId}

