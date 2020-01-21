const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');

const priceJson = require('../available/deliveryPrice');

const admin = require("firebase-admin");

const serviceAccount = require('../keys.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://up63cafe-2a26a.firebaseio.com"
});

// const registration_token = "ck_NiD2Vh9o:APA91bEIZIaO-xe88SmsMFiD21X5Tje2I0eBR90qSX5fBb1Rn3AhYtfiZFjDL6zI6U222UJef00km7Cj9CQRqrN5t3vvCaBZmYnzyXLZAkJw3diA7Wb8AmiiM7T9tq7VMu-8me9eEvhp";

const router = express.Router();

router.post('/update',(req,res)=>{
	const orderId = req.body.order_id ? req.body.order_id : "none";
	const status = req.body.status.toString();
	Notification.findOne({orderId:orderId}).then((notification)=>{
		if(notification){
			switch(status){
				case '0':
					notification.preparationStarted = true;
					break;						
			}
			notification.save().then(()=>{
				console.log('order prepared');
				res.json({status:true});
			})
		}
	})
})

router.get('/',(req,res)=>{
	// console.log(req.query)
	if(req.query.preparationStarted == 'false'){
		Notification.find({preparationStarted:false}).sort({createdAt:'descending'}).then((items)=>{
			getCustomerDetails(items).then((data)=>{
				res.json(data);
			})
		})
	}else if(req.query.preparationStarted == 'true'){
		Notification.find({preparationStarted:true,itemDelivered:false,itemPreapared:false}).sort({updatedAt:'ascending'}).then((items)=>{
			getCustomerDetails(items).then((data)=>{
				res.json(data);
			})
		})
	}else if(req.query.delivered == 'true'){
		Notification.find({itemDelivered:true}).sort({updatedAt:'ascending'}).then((items)=>{
			getCustomerDetails(items).then((data)=>{
				res.json(data);
			})
		})
	}else if(req.query.delivered == 'false'){
		Notification.find({itemDelivered:false,itemPreapared:true,deliveryBoyName:req.query.deliveryBoyName}).sort({updatedAt:'ascending'}).then((items)=>{
			getCustomerDetails(items).then((data)=>{
				res.json(data);
			})
		})		
	}
})

async function getCustomerDetails(items) {

	let promise = new Promise(async function(reslove1,reject1){

		let returnItems = [];

		for(let i=0;i<items.length;i++){
			let item = items[i];
			let getData = new Promise((resolve,reject)=>{
				User.findOne({email:item.customer_email}).then((user)=>{

					let dateString = item.createdAt.toString().split("G")[0];

					let newItems = {
						amount:item.amount,
						fcmId:item.fcmId,
						orderId:item.orderId,
						orderItems:item.orderItems,
						itemPreapared:item.itemPreapared,
						itemDelivered:item.itemDelivered,
						customer_email:item.customer_email,
						preparationStarted:item.preparationStarted,
						arrivedAt:dateString,
						deliveryCharge:item.deliveryCharge
					}

					newItems.name = user.name;
					newItems.address = user.address;
					newItems.nearByAddress = user.nearByAddress;
					newItems.phoneNo = user.phoneNo;

					resolve(newItems);
				})				
			})
			let result = await getData; 
			returnItems.push(result);
		}

		reslove1(returnItems);

	})

	let results = await promise;

	return results;
}

router.post('/',(req,res)=>{

	const email = req.body.email ? req.body.email : "none@gmail.com";

	User.findOne({email:email}).then((user)=>{
		if(user){
			user.address = req.body.address;
			user.nearByAddress = req.body.nearBy;
			user.phoneNo = req.body.phNumber;
			user.save().then(()=>{
				// console.log('edited');
				saveNotification(email,req.body.fcm_id,req.body.orderId,req.body.orderItems,req.body.email,req.body.total)
					.then(()=>{
						sendNotification(req.body.total);
						console.log('new order');
						res.json({status:true});
					})
			})
		}else {
			res.json({status:false})
		}
	})	

})


function sendNotification(total) {

	const topic = "admin";

	var message = {
		data:{
			title:"New Order Arrived",
			body:"hurry up!! new order arrived with paid amount of :" + total
		},
		topic:topic
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to admin', response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to admin', error);
	});	
}

function saveNotification(email,fcmId,orderId,orderItems,customer_email,amount) {

	const notification = new Notification({
		email:email,
		fcmId:fcmId,
		orderId:orderId,
		orderItems:orderItems,
		customer_email:customer_email,
		amount:amount,
		deliveryCharge:eval(priceJson.price)
	}).save();

	return notification;
}

module.exports = router;