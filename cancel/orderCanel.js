const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification')
var admin = require("firebase-admin");

router.post('/',(req,res)=>{
	Notification.findOneAndDelete({orderId: req.body.orderId}).then((prev)=>{
		sendNotification(req.body.orderId,prev.fcmId,req.body.message);
		res.json({status:true})
	})
})


function sendNotification(orderId,fcmId,cancelMessage) {
	const message = {
		data:{
			orderId:orderId,
			status:'-1',
			summary:cancelMessage
		},
		token:fcmId
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent Cancel message to user', response);
	  })
	  .catch((error) => {
	    console.log('Error sending Cancel message to user', error);
	  });
}

module.exports = router;