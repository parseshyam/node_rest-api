console.log('Starting users.js');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup',(req,res,next) => {
    // BEFORE ENCRYPTING PASSWORD AND STORING IN DATABASE CHECK IF USER ALREADY EXISTS ? BY USING REFERENCE AS EMAIL.
    User.find({email : req.body.email})
    .exec()
    .then(result => {
        if(result.length>=1){ // MEANS USER EXISTS.  && ALAWYS CHECK FOR LENGTH COZ THATS AN ARRAY.
            return res.status(409).json({   // 409 MEANS CONFLICT.
                Message : 'User already exists !' 
            });
        } else {  // MEANS USER DOES NOT EXISTS, SO WE CAN ENCRYPT PASSWORD AND IF THERES SUCESS WE CAN CREATE NEW USER.
            bcrypt.hash(req.body.password,10,(error,hash) => {
                if(error){
                    return res.status(500).json({
                        Error : error
                    });
                } else {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId,
                        email : req.body.email,
                        password : hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            Message : 'User Created !'
                        });
                    }).catch(error => {
                        console.log(error);
                        res.status(200).json({
                            Error : error
                        });
                    });
                }
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

// LOG USER IN [ AUTHENTICATION ].
router.post('/login',(req,res,next) => {
    User.findOne({ email : req.body.email })
    .exec()
    .then(user => {
        if(user.length < 0){
            return res.status(401).json({
                Message : ' AUTHENTICATION FAILED '
            });
        }
            bcrypt.compare(req.body.password, user.password, (error,result) => {
                if(error){
                    return res.status(401).json({
                        Message : ' AUTHENTICATION FAILED '
                    });
                }
                if(result){
                    const token = jwt.sign
                    ({
                        email : user.email,
                        userId : user._id
                     },
                     'Secrete_key',
                    { 
                        expiresIn: "1h"
                    });
                    console.log(token); //NEW ADDED 
                    return res.status(200).json({
                        Message: 'AUTHENTICATION SUCESSFUL !',
                        token : token 
                    });
                }
                return res.status(409).json({
                    Message : 'AUTHENTICATION FAILED !',
                });
            });
        
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

// DELETE USER BASED ON THEIR ID's.

router.delete('/:userId',(req,res,next) => {
    const id = req.params.userId;
    User.remove({ _id : id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            Message : 'User deleted !',
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

// DELETE ALL USERS AT ONCE

router.delete('/',(req,res,next) => {
    const id = req.params.userId;
    User.remove()
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            Message : 'All User deleted !',
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

module.exports = router;
