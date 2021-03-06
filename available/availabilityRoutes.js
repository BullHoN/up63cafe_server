const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

let paymentJson = require('../available/deliveryPrice.json');

let allowPayment = true;
let deliveryPrice = 12;

function getDeliveryPrice() {
	deliveryPrice = paymentJson.price;
}

function changeDeliveryPrice(amount) {
	paymentJson.price = amount;
	deliveryPrice = amount;
}

getDeliveryPrice();

const UPI_Id = "7081256474@ybl";
const UPI_Name = "Prakhar Bhatt";

router.get('/checkoutDetails',(req,res)=>{
	getDeliveryPrice();
	res.json({
		allowPayment:allowPayment,
		deliveryPrice:deliveryPrice,
		upiId:UPI_Id,
		upiName:UPI_Name
	})
})

router.get('/deliveryPrice',(req,res)=>{
	if(req.query.nwPrice){
	  changeDeliveryPrice(req.query.nwPrice);
	  // deliveryPrice = req.query.nwPrice;
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
	
	// console.log(categoryItems);

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
							// console.log(categoryItem + " saved");
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