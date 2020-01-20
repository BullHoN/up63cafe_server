const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	address:{
		type:String,
		default:"no address added"
	},
	nearByAddress:{
		type:String,
		default:"no nearby address"
	},
	phoneNo:{
		type:String,
		default:""
	},
	isVerified:{
		type:Boolean,
		default:false
	},
	otp:{
		type:Number,
		default:-1
	}
})

const User = mongoose.model('User',userSchema);

module.exports = User;