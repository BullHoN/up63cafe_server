const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/',(req,res)=>{

	let resposeData = {
		isValidEmail:false,
		isPasswordCorrect:false,
		isAccountVerified:false		
	}

	const email = req.body.email ? req.body.email : 'none@gmail.com';

	User.findOne({email:email}).then((user)=>{
		if(user){
			resposeData.isValidEmail = true;
			resposeData.isAccountVerified = user.isVerified;

			if(checkPassword(user.password,req.body.password)){
				resposeData.isPasswordCorrect = true;
				resposeData.userName = user.name;
			}

			res.json(resposeData);

		}else {
			res.json(resposeData);
		}
	})
})

function checkPassword(password_save,password_get) {
	return bcrypt.compareSync(password_get, password_save);
}

module.exports = router;