const express = require('express');

const DeliveryBoy = require('../models/DeliveryBoy');

const router = express.Router();


router.post('/deliveryBoy/update',(req,res)=>{

	const name = req.body.name ? req.body.name : "someone";

	DeliveryBoy.findOne({name:name}).then((deliveryBoy)=>{
		if(deliveryBoy){
			deliveryBoy.fcmId = req.body.fcmToken;
			deliveryBoy.save().then(()=>{
				res.json({status:true});
			})
		}
	})

})

router.post('/deliveryBoy/changeStatus',(req,res)=>{

	const name = req.body.name ? req.body.name : "someone";

	DeliveryBoy.findOne({name:name}).then((deliveryBoy)=>{
		if(deliveryBoy){
			deliveryBoy.isOnline = req.body.isOnline;
			deliveryBoy.save().then(()=>{
				res.json({status:true});
			})
		}else{
			res.json({status:false});
		}
	})

})

router.post('/register/deliveryBoy',(req,res)=>{
	// bypass the duplicate validataion
	console.log('new delivery boy registered!!');
	const deliveryBoy = new DeliveryBoy({
		name:req.body.name,
		phoneNo:req.body.phoneNo,
		fcmId:req.body.fcmId
	}).save().then(()=>{
		res.json({status:true});
	})

})

module.exports = router;