const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification')

const router = express.Router();

router.post('/',(req,res)=>{
	
	User.findOne({email:req.body.email}).then((user)=>{
		if(user){
			user.blocked = true;
			user.save().then(()=>{
				Notification.findOneAndDelete({orderId:req.body.order_id}).then(()=>{
					res.json({status:true});
				});
			})
		}
	})
})



module.exports = router;