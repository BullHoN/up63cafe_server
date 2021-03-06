const express = require('express');
const User = require('../models/User');
const sendMail = require('../mail/mail');

const router = express.Router();

router.post('/',(req,res)=>{

	let responseData = {
		isValidOtp:false
	}

	const email = req.body.email ? req.body.email : 'none@gmail.com';

	User.findOne({email:email}).then((user)=>{
		if(user){
			if(user.otp == req.body.otp){
				user.isVerified = true;
				responseData.isValidOtp = true;
				user.save();
			}
			res.json(responseData);
		}else {
			res.json(responseData);
		}
	})
})


router.get('/resend',(req,res)=>{

	let responseData = {
		otpSend:false
	}

	const email = req.query.email ? req.query.email : "noname@gmail.com";
	User.findOne({email:email}).then((user)=>{
		if(user){
			responseData.otpSend = true;
			sendMail(user.name,user.email,user.otp);
			res.json(responseData);
		}else {
			res.json(responseData);
		}
	})

})

module.exports = router;