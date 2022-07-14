const { isValidObjectId } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const moment = require('moment');
const bookModel = require("../models/bookModel");

//=================================================== Creating Reviews ================================================= 

const createReview = async (req, res) => {
    try{

            let bookId= req.params.bookId
            let data = req.body
            if(Object.keys(data).length==0){
                return res.status(400).send({status: false,msg:"Please Provide Some Data"})
            }
            data['bookId']=bookId
            
            if(!bookId){
                return res.status(400).send({status: false,msg:"Please Provide BookId"})
            }
            if(!isValidObjectId(bookId)){
                return res.status(400).send({status: false,msg:"Invalid BookId"})
            }
            let bookexist = await bookModel.findById(bookId)
            if(!bookexist){return res.status(404).send({status:false,msg:"No Book Found"})}
            if(bookexist['isDeleted']===true){return res.status(400).send({status:false,msg:"Book Has been Deleted"})}
        
            if(!data.rating){
                return res.status(400).send({status: false,msg:"Please Provide some rating"})

            }
            if(isNaN(data.rating)){
                return res.status(400).send({status: false,msg:"Please Enter Only Number in rating"})

            }
            if(data.rating<1 || data.rating>5){
                return res.status(400).send({status: false,msg:"Please rating btwn 1-5"})

            }
            if(!data.reviewedBy){
                let reviewedBy = "Guest"
                data['reviewedby'] = reviewedBy
            }
            if(!data.review){
                return res.status(400).send({status: false,msg:"Please Tell Us About Ur Review For This Book"})
            }

            let date = Date.now()
            let reviewedAt = moment(date).format("YYYY-MM-DD, hh:mm:ss")
            data['reviewedAt'] = reviewedAt

            const reviewes = await reviewModel.create(data)
            const bookReviwes = await bookModel.findOneAndUpdate({_id:data.bookId},{$inc:{reviews:+1}},{new:true})

            let result = bookReviwes.toObject()
            result.reviewData = reviewes
            return res.status(201).send({status:true, msg:"Reviewes Added Succesfully",data:result})
        
    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
}

//=========================================== Updating Reviews ===========================================================

const updateReview = async (req, res) => {
    try{
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter require data to update review" })
        }
        if(data.reviewedAt || data.bookId || data.isDeleted){
            return res.status(400).send({status: false,msg:"You can not update reviewedAt or bookId or Deleted"})

        }
        if(!isValidObjectId(bookId)){
            return res.status(400).send({status: false,msg:"Invalid BookId"})
        }
        let book = await bookModel.findById(bookId);
        if(book){
            if(book['isDeleted'] == true) return res.status(400).send({status: false, message: "The book has been deleted"});
        }else return res.status(404).send({status: false, message: "Book not found"});

        if(!isValidObjectId(reviewId)){
            return res.status(400).send({status: false,msg:"Invalid reviewId"})
        }
        let review = await reviewModel.findById(reviewId);
        if(review){
        
            if(review['isDeleted'] == true) return res.status(400).send({status: false, message:"Review has been deleted"});
        }else return res.status(404).send({status: false, message: "Review not found"});

        let update = await reviewModel.findOneAndUpdate({_id: reviewId},{$set: data},{new: true});
        let result = book.toObject();
        result.reviewsData = update;
        res.status(200).send({status: true, message: "Review Update Successfully", date: result});

    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
}

//================================================== Deleting Reviews ===================================================

const deleteReview = async (req, res) => {
    try{
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if(!isValidObjectId(bookId)){
            return res.status(400).send({status: false,msg:"Invalid BookId"})
        }
        let book = await bookModel.findById(bookId);
        if(book){
            if(book['isDeleted'] == true) return res.status(400).send({status: false, message: "The book has been deleted"});
        }else return res.status(404).send({status: false, message: "Book not found"});

        if(!isValidObjectId(reviewId)){
            return res.status(400).send({status: false,msg:"Invalid reviewId"})
        }
        let review = await reviewModel.findById(reviewId);
        if(review){
            if(review['isDeleted'] == true) return res.status(400).send({status: false, message:"Review has been deleted"});
        }else return res.status(404).send({status: false, message: "Review not found"});

        await reviewModel.findOneAndUpdate({_id: reviewId},{isDeleted: true},{new: true});
        await bookModel.findOneAndUpdate({_id: bookId},{$inc: {reviews: -1}}, {new: true});

        res.status(200).send({status: true, message: "Review deleted successfully"});
    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = {createReview,updateReview,deleteReview};