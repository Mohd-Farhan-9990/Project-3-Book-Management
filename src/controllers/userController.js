const userModel =require("../models/userModel")
const jwt = require('jsonwebtoken')

//=========================================== Registering User Here ======================================================

const createUser = async function(req,res){
   
   try{
        const data = req.body
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,msg:"Provide Some Data to Create User"})
        }
        let{title,name,phone,email,password,address} = data
        if(!title){
            return res.status(400).send({status:false,msg:"Please Enter title"})
        }
        if (["Mr", "Mrs", "Miss"].indexOf(title) == -1){
         return res.status(400).send({status: false, data: "Enter a valid title Mr or Mrs or Miss ",});
        }
        if(!name){
            return res.status(400).send({status:false,msg:"Please Enter Name"})
        }
        if(!/^[a-zA-Z \s]+$/.test(name)){
            return res.status(400).send({status:false,msg:"Please Enter Only Alphabets in Name"})
        }
        if(!phone){
            return res.status(400).send({status:false,msg:"Please Enter Phone"})
        }
        if(!/^[6-9]\d{9}$/.test(phone)){
            return res.status(400).send({status:false,msg:"Please Enter Valid Phone Number"})
        }
        let phoneCheck = await userModel.findOne({ phone:phone });
        if (phoneCheck){
        return res.status(400).send({ status: false, msg: "User With This Phone already Registerd" });
        }
        if(!email){
            return res.status(400).send({status:false,msg:"Please Enter email"})
        }
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).send({status:false,msg:"Please Enter Valid Email Id"})
        }

        let emailCheck = await userModel.findOne({ email:email });
        if (emailCheck){
        return res.status(400).send({ status: false, msg: "Email-Id already Registerd" });
        }
        if(!password){
            return res.status(400).send({status:false,msg:"Please Enter password"})
        }
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password)){
            return res.status(400).send({status:false,msg:"Password Should Contain at Least One Capital Letter and One Special Char and a number and length btwn 8-15"})
        }
        if(!address){
            return res.status(400).send({status:false,msg:"Please Enter address"})
        }

        name = name.replace(/\s\s+/g, ' ')
        data['name'] = name
        const user = await userModel.create(data)

        return res.status(201).send({status:true,msg:"User Is Created Succefully",data:user})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}

//============================================ Login Api =====================================================

const loginUser = async function(req,res){
    try{

        const data = req.body
        const {email,password} = data
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,msg:"Please Enter email and Password"})

        }
        if(!email){
            return res.status(400).send({status:false,msg:"Please Enter email"})
        }
        if(!password){
            return res.status(400).send({status:false,msg:"Please Enter password"})
        }
        const user =  await userModel.findOne({email:email,password:password})
        if(!user){
            return res.status(401).send({status:false,msg:"Invalid User"})

        }

// Creating Token Here

        const token = jwt.sign({
            userId:user._id.toString(),
          expiresIn: "30d" },
             "Project-3-Group-43"
            )
        res.setHeader("x-api-key",token)
        return res.status(201).send({status:true,msg:"User LoggedIn Succesfully",token:token})

    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}
module.exports = {createUser,loginUser}

