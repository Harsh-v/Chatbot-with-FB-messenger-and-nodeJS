'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
/*
const apipai = require('apiai')

const app = apiai(' ')
var request = app.textRequest(' ', {
    sessionId: ''
});
 
request.on('response', function(response) {
    console.log(response);
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();
*/
const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', function(req, res) {
	res.send("Hi I am a chatbot. Find me @ https://www.facebook.com/chatbot08/")
})

let token = "YOUR ACCESS TOKEN"


app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "Harshv") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if(text.includes("about vit")){
				sendText(sender, "VIT university was founded in 1984" }
			else if(text.includes("ai-vit")){
				sendText(sender, "Coming Soon! Just wait for it")
			}
			else{
				sendText(sender, "Text echo: " + text.substring(0, 100))
			}	
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})
