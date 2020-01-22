const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://Up63Users:PMz5rkroMTvbCR02@up63cafe-pzkyn.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log('conncted to mongodb'))
.catch((err)=>console.log(err));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

// routes
app.use('/login',require('./login/loginRoutes'));
app.use('/register',require('./signup/signUpRoutes'));
app.use('/otp',require('./otp/otpRoutes'));
app.use('/specials',require('./menu_routes/getspecials'));
app.use('/categories',require('./menu_routes/getCategories'));
app.use('/category',require('./menu_routes/getCategoryItems'));
app.use('/createOrder',require('./payment/createOrder'));
app.use('/notification',require('./payment/paymentNotification'));
app.use('/',require('./delivery/deliveryRoutes'));
app.use('/',require('./available/availabilityRoutes'));
app.use('/',require('./deliveryBoy_routes/deliveryBoyRoutes'));


// static images
app.use('/images',express.static('images'));
app.use('/',express.static('landing_page'));

// page routes
app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname,'/landing_page/index.html'))
})

const PORT = 8080;

app.listen(PORT,()=>{
	console.log("server is running at port 5000")
})
