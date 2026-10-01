const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
// Agar saytdagi HTML ni parse qilmoqchi bo'lsangiz cheerio ham ishlatish mumkin:
// const cheerio = require('cheerio');

// Bot tokeningizni shu yerga yozing
const token = 'Y8691570304:AAFOBUDpSZE49zfSO7P0rH_IDiKFRbvi1tc';
const bot = new TelegramBot(token, { polling: true });

// Sayt manzili
const WEBSITE_URL = 'https://diyorbekweb015.netlify.app/';

// Start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Assalomu alaykum! EduKontrol Academy (Pop tumani filiali) botiga xush kelibsiz.\n\nSaytimiz: ${WEBSITE_URL}\n\nQuyidagi tugmalar orqali ma'lumot olishingiz mumkin:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '💰 Narxlar va Kurslar', callback_data: 'prices' }],
                [{ text: '📍 Manzil va Aloqa', callback_data: 'contact' }],
                [{ text: '🌐 Saytga o\'tish', url: WEBSITE_URL }]
            ]
        }
    });
});

// Inline tugmalar bosilganda
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    
    if (query.data === 'prices') {
        const text = `📚 *EduKontrol Academy kurslari va narxlari* (Pop tumani):\n\n` +
                     `1️⃣ *HTML & CSS Asoslari*\n- Narxi: 350,000 so'm / oyiga\n\n` +
                     `2️⃣ *Frontend Kursi (HTML, CSS, JS)*\n- Narxi: 500,000 so'm / oyiga\n\n` +
                     `3️⃣ *Full-Stack Master (PRO)*\n- Narxi: 750,000 so'm / oyiga\n\n` +
                     `Batafsil saytimizdan ko'rishingiz mumkin: ${WEBSITE_URL}`;
        
        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } else if (query.data === 'contact') {
        bot.sendMessage(chatId, `📍 *Manzil:* Namangan viloyati, Pop tumani\n📞 *Telefon:* +998 90 123 45 67\n🌐 *Web sayt:* ${WEBSITE_URL}`, { parse_mode: 'Markdown' });
    }
    
    bot.answerCallbackQuery(query.id);
});

// Agar saytdan ma'lumotni dinamik ravishda tortib olmoqchi bo'lsangiz (Scraping):
bot.onText(/\/websayt/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get(WEBSITE_URL);
        if (response.status === 200) {
            bot.sendMessage(chatId, `✅ Sayt (${WEBSITE_URL}) muvaffaqiyatli ishlayapti va ma'lumotlar joyida!`);
        }
    } catch (error) {
        bot.sendMessage(chatId, `❌ Hozirda saytga ulanishda xatolik yuz berdi.`);
    }
});

console.log('Bot ishga tushdi...');
