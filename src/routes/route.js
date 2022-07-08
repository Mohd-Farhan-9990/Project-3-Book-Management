const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../middleware/auth.js")
const middleware2 = require("../middleware/auth2.js")



router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",middleware.authentication,middleware.authorisation, bookController.createBook)
router.get("/books",middleware.authentication,bookController.getBooks)

router.get("/books/:bookId",middleware.authentication,middleware2.authorisationbyBId,bookController.getBookById)

router.put("/books/:bookId",middleware.authentication,middleware2.authorisationbyBId,bookController.updateBooks)
router.delete("/books/:bookId",middleware.authentication,middleware2.authorisationbyBId,bookController.deleteById)
module.exports = router