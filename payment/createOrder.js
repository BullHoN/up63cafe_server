const express = require('express');
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_l6QxAjMLMH6QWZ',
  key_secret: '9p5UUlnR5KljTMY3WqrNd6Xq'
})

const router = express.Router();

router.post('/',(req,res)=>{

	var options = {
		amount: req.body.amount*100,  
		currency: "INR",
		receipt: "Up63Cafe_payment_recipt",
		payment_capture: '0',
		notes:{
		  email:req.body.email,
		  name:req.body.name
		 }
	};

	instance.orders.create(options, function(err, order) {
  		// console.log('new order created');
  		// instead use short id npm package !! 
  		res.json({
  			order_id:order.id,
  			amount:order.amount
  		})
	});

})

module.exports = router;