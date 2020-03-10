const specials = require('../menu/specials');
const express = require('express');

const router = express.Router();

let available = [];

specials.forEach((special,index)=>{
	available[index] = {
		itemName:special.itemName,
		isAvailable:true
	}
})

router.post('/toggleSpecials',(req,res)=>{
	let categoryItems = req.body.changedItems.split(',');
	
	for(let j=0;j<categoryItems.length;j++){
		let item = categoryItems[j].toString().trim();
		for(let i=0;i<available.length;i++){
			if(available[i].itemName == item){
				available[i].isAvailable = !available[i].isAvailable;
				break;
			}
		}
	}
	res.json({status:true});
})

router.get('/',(req,res)=>{
	if(req.query.admin){
		res.json(available);
	}else{
		let nwSpecials = [],i=0;
		available.forEach((avai,index)=>{
			if(avai.isAvailable){
				nwSpecials[i] = specials[index];
				i++;
			}
		})
		res.json(nwSpecials);
	}
})

module.exports = router;
