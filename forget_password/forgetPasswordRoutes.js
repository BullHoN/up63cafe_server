const router = require('express').Router();
const User = require('../models/User');
const mail = require('../mail/forgetMail');
const path = require('path');
const bcrypt = require('bcrypt');


router.post('/forget',(req,res)=>{
    const email = req.body.email ? req.body.email : "randome@gmail.com";
    User.findOne({email:email}).then((user)=>{
        if(user){
            // change url
            if(user.isVerified){
                const url = 'https://www.up63cafe.com/user/forget/' + user._id;
                mail(user.name,email,url);
                res.json({status:true});
            }else {
                res.json({status:false});
            }
        }else {
            res.json({status:false})
        }
    })
})


router.get('/forget/:id',(req,res)=>{
    const id = req.params.id ? req.params.id : "asfasf";
    User.findOne({_id:id}).then((user)=>{
        if(user){
            res.sendFile(path.resolve(__dirname,"forgetPassword.html"));
        }else {
            res.sendStatus(404);
        }
    }).catch((err)=>{
        if(err)
            res.sendStatus(404);
    })
})


router.post('/forget/:id',(req,res)=>{
    const id = req.params.id ? req.params.id : "asfasf";
    User.findOne({_id:id}).then((user)=>{
        if(user){
            user.password = generateEncryptedPassword(req.body.password);
            user.save().then(()=>{
                res.json({status:true});
            }).catch((err)=>{
                res.json({status:false});
            })
        }else {
            res.json({status:false})
        }
    }).catch((err)=>{
        if(err)
            res.json({status:false});
    })
})

function generateEncryptedPassword(password) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}


module.exports = router;
