const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN; // 从环境变量中读取 Bot Token
const CHAT_ID = process.env.CHAT_ID;     // 从环境变量中读取 Chat ID


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
    const { name, room, email, message } = req.body;

    const telegramMessage = `
        New Dorm Registration:
        Name: ${name}
        Room: ${room}
        Email: ${email}
        Message: ${message}
    `;

    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: telegramMessage
    })
    .then(response => {
        if (response.data.ok) {
            res.send('Registration information has been sent successfully!');
        } else {
            res.status(500).send('Failed to send the registration information to Telegram.');
        }
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send('Error sending message to Telegram.');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
