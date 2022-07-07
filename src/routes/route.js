const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController=require("../controllers/reviewController")
const middleware = require("../middleware/auth.js")


/**************************************[PROJECT-API's]****************************************/
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",middleware.authentication,middleware.authorisation, bookController.createBook)
router.get("/books",bookController.getBooks)
router.get("books/:bookId",bookController.getBookById)
router.put("/books/:bookId",bookController.updateBooks)
router.delete("/books/:bookId",bookController.deleteById)

/**************************************[Revies=API's]*****************************************/
router.post('/books/:bookId/review', reviewController.addReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)




module.exports = router