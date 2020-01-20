const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();


let allowPayment = false;
let deliveryPrice = 12;


router.get('/checkoutDetails',(req,res)=>{
	res.json({
		allowPayment:allowPayment,
		deliveryPrice:deliveryPrice
	})
})

router.get('/deliveryPrice',(req,res)=>{
	if(req.query.nwPrice){
	  deliveryPrice = req.query.nwPrice;
	  res.json({changed:true});
	}else{
	  res.json({deliveryPrice:deliveryPrice});
	}
})

router.get('/changePaymentStatus',(req,res)=>{
	allowPayment = !allowPayment;
	res.json({changed:true});
})

router.get('/getPaymentStatus',(req,res)=>{
	res.json({allowPayment:allowPayment})
})


router.post('/toggleAvailability',(req,res)=>{

	let categoryItems = req.body.changedItems.split(',');
	
	console.log(categoryItems);

	toggleAvailability(categoryItems).then((val)=>{
		res.json({status:val})
	})
	
})

async function toggleAvailability(categoryItems) {
	let promise = new Promise(async function (reslove1,reject1) {
		for(let i=0;i<categoryItems.length;i++){
			let categoryItem = categoryItems[i].trim();

			let updateItem = new Promise((resolve,reject)=>{
				MenuItem.findOne({itemName:categoryItem}).then((category)=>{
					if(category){
						category.isAvailable = !category.isAvailable;
						category.save().then(()=>{
							console.log(categoryItem + " saved");
							resolve(1);
						});
					}
				})
			})

			let s = await updateItem;
		}

		reslove1(true);
	})

	return await promise;
}


module.exports = router;