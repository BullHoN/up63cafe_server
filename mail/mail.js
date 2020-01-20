const nodemailer = require('nodemailer');


function sendMail(name,email,otp){
	console.log(name,email,otp);

	let transporter = nodemailer.createTransport({
		service:"gmail",
		auth:{
			user:"contact.up63cafe@gmail.com",
			pass:'Up_63-CAFe/JUice'
		}
	});

	let emailOptions = {
		from:'"Up63Cafe" <contact.up63cafe@gmail.com>',
		to:email,
		subject:'Account Conformation',
		html:`

		<html>
			<head>
				<style>
					#title{
						color:#333;
					}


					h3 , h4 {
						color:#575757;
					}

					footer {
						cursor:pointer;
						margin-top:10px;
						padding:25px;
						margin-right:16px;
						max-width:200px;
						text-align:center;
						background:#eee;
					}

					#footer {
						display:flex;
					}

					a{
						text-decoration:none;
						color:#575757;
					}

				</style>
			</head>
			<body>
				<h2 id="title">Thanks "${name}" for registering in Up63Cafe</h2>

				<h3>Your verification otp is <q><span>${otp}</span></q></h3>

				<div id="footer">
					<footer>
						<a href="https://www.up63cafe.com"><h4>privacy policies</h4></a>
					</footer>

					<footer>
						<a href="https://www.up63cafe.com"><h4>Contact us</h4></a>
					</footer>
				</div>
			</body>
		</html>	

		`
	}

	transporter.sendMail(emailOptions,(err,info)=>{
		if (err) throw err;
		console.log('mail send');
	})

}


module.exports = sendMail
