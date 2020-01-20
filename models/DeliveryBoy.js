const mongoose = require('mongoose');

const deliveryBoySchema = mongoose.Schema({
	name:String,
	fcmId:String,
	phoneNo:String,
	isOnline:{
		type:Boolean,
		default:true
	},
	count:{
		type:Number,
		default:0
	},
	currentItems:[{
		orderId:String
	}]
});

const DeliveryBoy = mongoose.model('DeliveryBoy',deliveryBoySchema);

module.exports = DeliveryBoy;