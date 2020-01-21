const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	amount:Number,
	fcmId:String,
	orderId:String,
	orderItems:String,
	itemPreapared:{
		type:Boolean,
		default:false
	},
	itemDelivered:{
		type:Boolean,
		default:false
	},
	preparationStarted:{
		type:Boolean,
		default:false
	},
	customer_email:String,
	deliveryBoyName:{
		type:String,
		default:''
	},
	deliveryCharge:{
		type:Number,
		default:-1
	}
},{ timestamps: true });

const Notification = mongoose.model('Notification',notificationSchema);

module.exports = Notification;