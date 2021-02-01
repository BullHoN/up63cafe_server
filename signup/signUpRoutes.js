const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendMail = require('../mail/mail');

const router = express.Router();

router.post('/',(req,res)=>{

	let responseData = {
		isAlreadyUser:false,
		isAccountVerified:false
	}

	const email = req.body.email;
	let emailOffset = email.split('@')[1];
	let lastIndex = emailOffset.indexOf('.');

	if(emailOffset.substring(lastIndex) != '.com'){
		console.log(email + " was invalid...")
		return;
	}


	User.findOne({email:email}).then((user)=>{
		if(user){
			console.log('already a user');
			responseData.isAlreadyUser = true;
			if(user.isVerified)
				responseData.isAccountVerified = true;
			res.json(responseData);
		}else {

			let otp = Math.round((Math.random()*100000))

			registerNewUser(email,req.body.password,req.body.name,otp).save()
				.then(()=>{
					console.log('new user saved');
					sendMail(req.body.name,email,otp);
					res.json(responseData);
			})
		}
	})
})

function registerNewUser(email,password,name,otp){

	const user = new User({
		email:email,
		password:generateEncryptedPassword(password),
		name:name,
		otp:otp
	})
	return user;
}

function generateEncryptedPassword(password) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}

module.exports = router;