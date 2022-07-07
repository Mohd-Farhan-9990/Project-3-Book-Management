const { isValidObjectId ,default:mongoose} = require("mongoose");
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const moment = require('moment')

const createBook = async function (req, res) {

    try {

        let data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter require data to create Book" })
        }
        const { title, excerpt, userId, ISBN, category, subcategory } = data;

        if (!title) {
            return res.status(400).send({ status: false, msg: "please enter Book title" })
        }
        let checktitle = await bookModel.findOne({ title: title })

        if (checktitle){
             return res.status(400).send({ status: false, message: "Title Already Exists" })
        }
        if (!/^[a-zA-Z \s]+$/.test(title)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in title" })
        }
        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "please enter excerpt" })
        }
        if (!/^[a-zA-Z \s]+$/.test(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in excerpt" })
        }
        if (!userId) {
            return res.status(400).send({ status: false, msg: "please enter userId" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: " invalid objectId" })

        }
        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "please enter ISBN" })
        }
        if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit)' })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })

        if (checkISBN){
             return res.status(400).send({ status: false, message: "ISBN Already Exists" })
        }

        if (!category) {
            return res.status(400).send({ status: false, msg: "please enter Book category" })
        }
        if (!/^[a-zA-Z \s]+$/.test(category)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in tittle" })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "please ented subcategory" })
        }
        if (!/^[a-zA-Z \s]+$/.test(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in subcategory" })
        }
//Creating Data Here

        let date = Date.now()                                               //getting timestamps value
        let releasedAt = moment(date).format('YYYY-MM-DD, hh:mm:ss')        //formatting date
        data['releasedAt'] = releasedAt
        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, msg: "success", data: savedData })

    }
    catch (err) {
        return res.status(500).send({ status: false, mag: err.message })
    }
}

//=================================================Get Books Api========================================================

const getBooks = async (req, res) => {
    try {
        let data = req.query;
        let { userId, category, subcategory } = data;
        let filter = {
            isDeleted: false,
            ...data
        };
        if (userId) {
            if (!isValidObjectId(userId)) {
                res.status(400).send({ status: false, message: "This is not a valid user id" });
            }
            let findById = await userModel.findOne({ userId });
            if (!findById) {
                res.status(404).send({ status: false, message: "No user with this id exist" });
            }
        }
        if (category) {
            let findByCategory = await userModel.findOne({ category: category });
            if (!findByCategory) {
                res.status(404).send({ status: false, message: "No books with this category exist" });
            }
        }
        if (subcategory) {
            let findBySubcategory = await userModel.findOne({ subcategory: { $in: [subcategory] } });
            if (!findBySubcategory) {
                res.status(404).send({ status: false, message: "No books with this Subcategory exist" });
            }
        }

        let books = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: +1 });
        if (books.length == 0) {
            return res.status(404).send({ status: false, message: "No books found with the given query" });
        }

        res.status(200).send({ status: true, message: "Book lists", data: books });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

const getBookById = async (req, res) => {
    try {
        let id = req.params.bookId;

        if(!id){
            res.status(400).send({status: false, message: "Please enter a book ID."});
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).send({status: false, message: 'Invalid book id'});
        }

        let bookData = await bookModel.findById(id).select({ISBN: 0, deletedAt: 0, _v: 0});
        if(!bookData){
            res.status(404).send({status: false, message: 'No Book exists with that id'});
        }
        
        let reviews = await reviewModel.find({bookId: id})
        let temp = JSON.stringify(bookData);
        let result = JSON.parse(temp);
        result.reviewsData = reviews;

        res.send({status: true, message: 'Book list', data: result});
    }catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



const deleteById = async function (req,res){
    try{
            let bookId = req.params.bookId
            console.log(bookId)
            let bookexist = await bookModel.findOne({_id:bookId,isDeleted:false})
            if(!bookexist){
                return res.status(404).send({status:false,msg:"Book Not Found"})                                  
            }

            
            let date = Date.now()                                               //getting timestamps value
            let deletedAt = moment(date).format('YYYY-MM-DD, hh:mm:ss')        //formatting date
            let deleteBook = await bookModel.findOneAndUpdate({_id:bookId},
                                                                {$set:{isDeleted:true,deletedAt:deletedAt}},
                                                                {new:true})
                                
            if(deleteBook){
                return res.status(200).send({status:true,msg:"Book is Deleted"})
            } 
    }   
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }                                               

}
module.exports = { createBook, getBooks,getBookById,deleteById }