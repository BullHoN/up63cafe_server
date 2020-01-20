const express = require('express');

const MenuItem = require('../models/MenuItem')

const router = express.Router();

router.get('/admin/:id',(req,res)=>{
	// console.log(req.params);

	MenuItem.find({category:req.params.id}).then((menuItems)=>{
		res.json(menuItems);
	})

})

router.get('/:id',(req,res)=>{
	// console.log(req.params);

	MenuItem.find({category:req.params.id,isAvailable:true}).then((menuItems)=>{
		res.json(menuItems);
	})

})

module.exports = router;