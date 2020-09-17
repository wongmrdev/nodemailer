if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const { getMaxListeners } = require('process');

const app = express();
// View Engine setup
app.engine('handlebars', expressHandlebars({extname: "handlebars", layoutsDir: "views/"}));
app.set('view engine', 'handlebars');

//Body Parser Middlewere

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('contact', {layout: false});
});

app.post('/send-email-verification-code', (req, res) => {
    const output = `
    <p> you have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.username}</li>
        <li>Company: Recipe App</li>
        <li>Email: ${req.body.email} </li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        // port: 465,
        // secure: false,
        auth: {
            user: "matthew.raymond.wong@gmail.com",
            pass: process.env.SMTP_EMAIL_PASSWORD
        }
    })
    
    let mailOptions = {
        from: '"Matthew Wong" <matthew.raymond.wong@gmail.com>',
        to: 'matthew.raymond.wong@gmail.com',
        subject: 'Family Recipe App Email Verification',
        text: '',
        html: output

    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) { 
            return console.log(error)
        }
        console.log(`message sent: ${info.messageId}`)
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
        //render back to app
        //res.render('contact', {msg: "email has been send"})
        //return response to server
        res.status(200).json({message:`message sent: ${info.messageId}`, success: true})



    })
    
} )
app.listen(process.env.PORT || 5003, () => console.log('mailserver started...'))


