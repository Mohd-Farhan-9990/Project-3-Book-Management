
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

///////////////////////////////////// Authentication ///////////////////////////////////////////////

const authentication = async function (req, res, next) {
    try {
        let userId = req.body.userId;
        let user = await userModel.findById({ _id: userId })
        if (!user) {
            return res.status(404).send({ status: false, msg: "No such user exist" })
        }

        let token = req.headers["x-api-key"]
        if (!token) token = req.headers["X-API-KEY"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "token not found" })
        }

        let decodedtoken = jwt.verify(token, "Project-3-Group-43")
        if (!decodedtoken) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }


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


module.exports = { authentication, authorisation }