const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
	category:String,
	itemName:String,
	halfPlatePrice:Number,
	fullPlatePrice:Number,
	isAvailable:{
		type:Boolean,
		default:true
	}
});

const MenuItem = mongoose.model('MenuItem',menuItemSchema);

module.exports = MenuItem;