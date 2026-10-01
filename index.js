const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const token = '8691570304:AAHjs5-CmOVVmCp4LCyyzitdmCQydzVBd-Q'; // Bot tokeningiz
const adminId = '1947310106'; // O'zingizning Telegram ID raqamingiz

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

// Veb-saytdan keladigan ariza endpointi
app.post('/send-application', async (req, res) => {
    try {
        const { name, phone, course, payment, comment } = req.body;

        const message = `🚀 <b>Yangi ariza keldi! (EduKontrol)</b>\n\n` +
                        `👤 <b>F.I.O:</b> ${name}\n` +
                        `📞 <b>Telefon:</b> ${phone}\n` +
                        `📚 <b>Kurs:</b> ${course}\n` +
                        `💳 <b>To'lov turi:</b> ${payment}\n` +
                        `💬 <b>Izoh:</b> ${comment}`;

        // Arizani Telegram bot orqali sizga yuborish
        await bot.sendMessage(adminId, message, { parse_mode: 'HTML' });

        res.json({ success: true, message: "Ariza botga yuborildi!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Xatolik yuz berdi" });
    }
});

app.listen(3000, () => {
    console.log('Server 3000-portda ishlamqda...');
});
