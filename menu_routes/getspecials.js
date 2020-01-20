const specials = require('../menu/specials');
const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
	res.json(specials);
})

module.exports = router;
