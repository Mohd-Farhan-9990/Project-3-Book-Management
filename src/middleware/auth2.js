const bookModel = require("../models/bookModel")

const authorisationbyBId = async function(req,res,next){
        let bookId = req.params.bookId
        
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "please enter bookId in params" })
            }

        let bookData = await bookModel.findById(bookId)
        if(bookData.userId.toString() !== req.userId){
        return res.status(403).send({status: false, message: 'Unauthorized access'});
        }
        
        next()
}

module.exports = {authorisationbyBId}

