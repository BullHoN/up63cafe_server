const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/',(req,res)=>{

	const email = req.body.email;

	console.log("New User",email);

	User.findOne({email:email}).then((user)=>{
		if(user){ // User Already Present
			res.json({status:true});
		}else{ // New User
			const user = new User({
				email:email,
				name: req.body.name,
				isVerified: true
			}).save().then(()=>{
				res.json({status:true});
			})
		}
	})
	.catch((err)=>{
		res.json({status:false});
	})
})

module.exports = router;