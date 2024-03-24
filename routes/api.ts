// const express = require("express")
// const jwt = require('jsonwebtoken')
// const router = express.Router()
// const mongoose = require('mongoose');
// const User = require("../models/user")


// //defi=ine connection to the db
// const dbConnect = "mongodb+srv://admin:adminPASS@cluster0.mwrenxs.mongodb.net/auth"

// mongoose.connect(dbConnect, err =>{
//     if(err){
//         console.error("Error!", err);
//     }else{
//         console.log("Connected successfully Yaay!!");
//     }
// })

// router.get('/', (req,res)=> {
//     res.send("FROM API ROUTER");
// })

// router.post("/auth/register", (req, resp)=>{
//     let userdata = req.body
//     const user = new User(userdata);
    
//     user.save((error, registeredUser)=>{

//         if (error){
//             console.log(error);
//         }else{

//             //genarate a token for the user
//             const payload ={subject: registeredUser._id}
//             const token = jwt.sign(payload, 'secretkey')
//             resp.status(200).send({token});
//         }
//     })
// })

// //login 
// router.post("/auth/login", (req,resp)=>{
//     let userData = req.body

//     //check user if exits in  db
//     User.findOne({email: userData.email}, (error, dbUser)=>{
//         if(error){
//             console.log(error);
//         }else{
//             if(!dbUser){
//                 resp.status(401).send("Invalid Email");

//             }else{
//                 if(dbUser.password !=userData.password){
//                     resp.status(401).send("Invalid password");
//                 }else{
//                     let payload ={ subject: dbUser._id}
//                     let token = jwt.sign(payload, "secretkey")
//                     resp.status(200).send({token});
//                 }
//             }
//         }
//     })
// })

// //verify the token
// const verifyToken = (req, resp, next)=>{
//     if(!req.headers.authorization){
//         return resp.status(401).send("Unauthorized request!!")
//     }
//     let token = req.headers.authorization.split(' ')[1]

//     //check if the token is null
//     if(token =="null"){
//         resp.status(401).send("Unauthorized")
//     }

//     let payload = jwt.verify(token, "secretkey")

//     if(!payload){
//         resp.status(401).send("Unauthorized")
//     }

//     req.userId=payload.subject
//     next();
// }

