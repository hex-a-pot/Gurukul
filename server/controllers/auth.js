import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import {createJWT} from '../utils/auth.js'


//-------------------- TO UNDERSTAND BCRYPT and JWT-----------------------

// const saltRounds = 10;
// var password = "SamplePassword123"
// const dummyUser = new User({
//     name:"testUser",
//     email: "dummymail@something.com",
//     password: password
// })

// bcrypt.genSalt(saltRounds,(err,salt)=>{
//     console.log(salt)
//     bcrypt.hash(password,salt,(err,hash)=>{
//         console.log(hash);
//         bcrypt.compare(password,hash,(err,result)=>{
//             console.log(result);
//             let token = jwt.sign(JSON.stringify(dummyUser),process.env.TOKEN_SECRET)
//             if(result)
//             {
//                 console.log('token is - '+token)
//             }
//         })
//     })
// })

//---------------------------------------------------------------

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const signup = (req,res,next)=>{
    let {name,email,password,password_confirmation} = req.body;

    let errors = [];
    if(!name)
    {
        errors.push({name:"required"});
    }
    if (!email) {
        errors.push({ email: "required" });
      }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
      }
    if (!password) {
        errors.push({ password: "required" });
      }
    if (!password_confirmation) {
        errors.push({
         password_confirmation: "required",
        });
      }
    if (password != password_confirmation) {
        errors.push({ password: "mismatch" });
      }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
      }

    User.findOne({email:email})
    .then(user=>{
        if(user)
        {
            return res.status(422).json({errors:[{user:"email already exists"}]});
        }
        else
        {
           const user = new User({
               name:name,
               email: email,
               password: password
           })
           bcrypt.genSalt(10, function(err,salt){
               bcrypt.hash(password,salt,function(err,hash){
                   if(err) throw err;
                   user.password = hash;
                   user.save().then(
                       response=>{
                           res.status(200).json({
                               success:true,
                               result: response
                           })
                       }
                   )
                   .catch(err=>{
                       res.status(500).json({
                           errors:[{error:err}]
                       })
                   })
               })
           })
        }
    }).catch(err => {
        res.status(500).json({
            errors:[{error:'Something went wrong!!'}]
        })
    })
}

export const signin = (req,res)=>{
    let {email,password} = req.body;

    let errors = [];
    if (!email) {
       errors.push({ email: "required" });
     }
    if (!emailRegexp.test(email)) {
       errors.push({ email: "invalid email" });
     }
    if (!password) {
       errors.push({ passowrd: "required" });
     }
    if (errors.length > 0) {
      return res.status(422).json({ errors: errors });
     }


    User.findOne({email:email}).then(user=>{
        if(!user)
        {
            return res.status(404).json({
                errors:[{user:"not found!!"}],
            });    
        }
        else
        {
            bcrypt.compare(password,user.password).then(isMatch=>{
                if(!isMatch){
                    return res.status(400).json({errors:[{password:"incorrect"}]})
                }
                let access_token = createJWT(
                    user.email,
                    user._id,
                    3600
                );
                jwt.verify(access_token,process.env.TOKEN_SECRET,
                    (err,decoded)=>{
                        if(err){
                            res.status(500).json({errors:err});
                        }
                        if(decoded){
                            return res.status(200).json({
                                success:true,
                                token:access_token,
                                message: decoded
                            })
                        }
                    })
            }).catch(err=>{
                res.status(500).json({errors:err});
            })
        }
    }).catch(err=>{
        res.status(500).json({errors:err});
    })
}


// ---------------------- use of TOKEN-------------------------


// export const getMe = (req,res)=>{
//     var token = req.headers['x-access-token'];
//     if(!token)
//     {
//         res.status(401).send({auth:false,message:'No token Provided!!!'})
//     }
//     jwt.verify(token,process.env.TOKEN_SECRET,(err,decoded)=>{
//         if(err)
//         res.status(500).send({auth:false,message:"Failed to authenticate token"})
//         res.status(200).send(decoded);
//     })

// }

// -------------------------------------------------------------