const express = require('express');
const categories = require('../menu/categories');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.get('/admin',(req,res)=>{
	let results = getModifiedCategories().then((items)=>{
		res.json(items);
	})
})

async function getModifiedCategories() {
	let promise = new Promise(async function (reslove1,reject1) {
		let responseData = [];
		for(let i=0;i<categories.length;i++){
			const category = categories[i];

			let getCountAll = new Promise((resove,reject)=>{
				MenuItem.countDocuments({category:category.categoryName},function (err,count) {
					resove(count);
				})				
			})

			let getCountAvailable = new Promise((resove,reject)=>{
				MenuItem.countDocuments({category:category.categoryName , isAvailable:true},function (err,count) {
					resove(count);
				})				
			})

			let countAll = await getCountAll;
			let countAvailable = await getCountAvailable;

			responseData.push({
				categoryName:category.categoryName,
				totalItems:countAll,
				availableItems:countAvailable
			})
		}
		reslove1(responseData);
	})
	return await promise;
}

router.get('/',(req,res)=>{
	res.json(categories);
})

module.exports = router;