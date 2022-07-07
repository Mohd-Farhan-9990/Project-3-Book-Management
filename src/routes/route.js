const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../middleware/auth.js")



router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",middleware.authentication,middleware.authorisation, bookController.createBook)
router.get("/books",bookController.getBooks)
router.get("books/:bookId",bookController.getBookById)
router.put("/books/:bookId",bookController.updateBooks)
router.delete("/books/:bookId",bookController.deleteById)
module.exports = router