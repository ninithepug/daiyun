const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// 从环境变量中读取 Bot Token 和 Chat ID
const BOT_TOKEN = process.env.BOT_TOKEN; 
const CHAT_ID = process.env.CHAT_ID;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
    const { telegramUsername, gender } = req.body;

    let telegramMessage = `Telegram账号: @${telegramUsername}\n`;

    if (gender === 'male') {
        // 男性表单数据
        const {
            male_age, male_frequency, male_city, male_ovulation,
            male_work, male_character, male_previous, male_abortion,
            male_special, male_method
        } = req.body;

        telegramMessage += `
            新报名（男性）:
            1. 年龄和结婚时间: ${male_age}
            2. 做爱频率和备孕情况: ${male_frequency}
            3. 所在城市及问题: ${male_city}
            4. 排卵期和是否能来北京: ${male_ovulation}
            5. 你和夫人的工作、身高、体重、三围: ${male_work}
            6. 你和夫人的性格及是否同意: ${male_character}
            7. 之前是否助孕过: ${male_previous}
            8. 是否有打胎史: ${male_abortion}
            9. 是否有绿帽或绿奴: ${male_special}
            10. 想自然受孕还是间接注射: ${male_method}
        `;
    } else if (gender === 'female') {
        // 女性表单数据
        const {
            female_age, female_frequency, female_city, female_ovulation,
            female_work, female_character, female_previous, female_abortion,
            female_method
        } = req.body;

        telegramMessage += `
            新报名（女性）:
            1. 年龄和结婚时间: ${female_age}
            2. 做爱频率和备孕情况: ${female_frequency}
            3. 所在城市及问题: ${female_city}
            4. 排卵期和是否能来北京: ${female_ovulation}
            5. 你和夫人的工作、身高、体重、三围: ${female_work}
            6. 你和夫人的性格及是否同意: ${female_character}
            7. 之前是否助孕过: ${female_previous}
            8. 是否有打胎史: ${female_abortion}
            9. 想自然受孕还是间接注射: ${female_method}
        `;
    }

    // 发送消息到 Telegram
    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: telegramMessage
    })
    .then(response => {
        if (response.data.ok) {
            res.send('表单信息已成功发送到 Telegram！');
        } else {
            res.status(500).send('无法将信息发送到 Telegram。');
        }
    })
    .catch(error => {
        console.error('发送消息到 Telegram 时出错:', error.response ? error.response.data : error.message);
        res.status(500).send('发送消息到 Telegram 时出错。');
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
