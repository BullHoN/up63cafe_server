const express = require('express');

const DeliveryBoy = require('../models/DeliveryBoy');

const Notification = require('../models/Notification');
var admin = require("firebase-admin");

const router = express.Router();


router.post('/delivered',(req,res)=>{

	const orderId = req.body.orderId ? req.body.orderId : "order_id";

	Notification.findOne({orderId:orderId}).then((notification)=>{
		if(notification){
			notification.itemDelivered = true;
			notification.save().then(()=>{
				let summary = (notification.orderItems.split(',')[0] + "...").replace("_h","").replace("_f","");
				sendNotificationToUser(notification.orderId,notification.fcmId,summary,'2')
				res.json({status:true});
			})
		}else{
			res.json({status:false});
		}
	})


	DeliveryBoy.findOne({name:req.body.deliveryboyName}).then((deliveryBoy)=>{
		if(deliveryBoy){
			deliveryBoy.count = deliveryBoy.count + 1;
			let currentItems = [];
			currentItems =  deliveryBoy.currentItems.filter((item)=> item.orderId != orderId);
			deliveryBoy.currentItems = currentItems;
			deliveryBoy.save().then(()=>{
				console.log('delivery boy saved');
			})
		}
	})

})

router.post('/assignDeliveryBoy',(req,res)=>{
	// console.log(req.body);
	const name = req.body.deliveryBoyName;
	DeliveryBoy.findOne({name:name}).then((deliveryBoy)=>{
		if(deliveryBoy){
			let currentItems = deliveryBoy.currentItems;
			currentItems.push({
				orderId:req.body.orderId
			});
			deliveryBoy.currentItems = currentItems;
			deliveryBoy.save().then(()=>{
				sendNotificationToDeliveryboy(deliveryBoy);
			})
		}
	})

	Notification.findOne({orderId:req.body.orderId}).then((notification)=>{
		if(notification){
			notification.itemPreapared = true;
			notification.deliveryBoyName = name;
			notification.save().then(()=>{
				console.log('edited noti success');

				let summary = (notification.orderItems.split(',')[0] + "...").replace("_h","").replace("_f","");

				sendNotificationToUser(notification.orderId,notification.fcmId,summary,'1')
				res.json({send:true});
			})
		}else {
			res.json({send:false});
		}
	})

})

function sendNotificationToUser(orderId,fcmId,summary,status) {
	const message = {
		data:{
			orderId:orderId,
			status:status,
			summary:summary
		},
		token:fcmId
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to user', response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to user', error);
	  });
}

function sendNotificationToDeliveryboy(deliveryBoy) {

	const message = {
		data:{
			title:"New Order arrived",
			body:"Hurry up new order from up63cafe"			
		},
		token:deliveryBoy.fcmId
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to ' + deliveryBoy.name, response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to' + deliveryBoy.name, error);
	  });	

}

router.get('/deliveryBoys',(req,res)=>{
	DeliveryBoy.find({isOnline:true}).then((allBoys)=>{
		res.json(allBoys)
	})
})

module.exports = router;