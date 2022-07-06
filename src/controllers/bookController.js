const  {isValidObjectId}  = require("mongoose");
const bookModel = require("../models/bookModel")

const createBook = async function(req , res){

    try{

    let data = req.body;
    if(Object.keys(data).length==0){
        return res.status(400).send({status : false , msg : "please enter require data to create Book"})
    }
        const {title, excerpt , userId , ISBN , category , subcategory} = data;
        
        if(!title){
            return res.status(400).send({status : false, msg : "please enter Book title"})
        }
        if(!/^[a-zA-Z \s]+$/.test(title)){
            return res.status(400).send({status:false,msg:"Please Enter Only Alphabets in title"})
        }
        if(!excerpt){
            return res.status(400).send({status : false, msg : "please enter excerpt"})
        }
        if(!/^[a-zA-Z \s]+$/.test(excerpt)){
            return res.status(400).send({status:false,msg:"Please Enter Only Alphabets in excerpt"})
        }
        if(!userId){
            return res.status(400).send({status : false, msg : "please enter userId"})
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({status : false , msg : " invalid objectId"})

        }

        if(!ISBN){
            return res.status(400).send({status : false, msg : "please enter ISBIN"})
        }
        
        if(!category){
            return res.status(400).send({status : false, msg : "please enter Book category"})
        }
        if(!/^[a-zA-Z \s]+$/.test(category)){
            return res.status(400).send({status:false,msg:"Please Enter Only Alphabets in tittle"})
        }

        if(!subcategory){
            return res.status(400).send({status : false , msg : "please ented subcategory"})
        }
        if(!/^[a-zA-Z \s]+$/.test(subcategory)){
            return res.status(400).send({status:false,msg:"Please Enter Only Alphabets in subcategory"})
        }
        
        let savedData = await bookModel.create(data)
        return res.status(201).send({status : true , msg : "success"  , data:savedData})

    }
    catch(err){
        return res.status(500).send({status:false , mag: err.message})
    }
}
module.exports = {createBook}