const nodemailer = require('nodemailer');


function sendMail(name,email,url){

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
		subject:'Forget Password',
		html:`
            <!DOCTYPE html>
            <head>
                <style>
                    h3,
                    h4 {
                        color: #575757;
                    }
                    
                    footer {
                        cursor: pointer;
                        margin-top: 10px;
                        padding: 25px;
                        margin-right: 16px;
                        max-width: 200px;
                        text-align: center;
                        background: #eee;
                    }
                    
                    #footer {
                        display: flex;
                    }
                    
                    a {
                        text-decoration: none;
                        color: #575757;
                    }
                </style>
            </head>
            
            <body>
                <h3>Hey,${name} Looks Like You Forget Your Password</h3>
                <a href="${url}">Change Password</a>
                <h4>Don't Share This Mail With Anyone</h4>
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
		console.log('forget password mail send');
	})

}


module.exports = sendMail
