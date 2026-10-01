const TelegramBot = require('node-telegram-bot-api');

// Botingiz tokenini shu yerga yozing
const token = '8691570304:AAFglsfmIFlKezcDuIXNWjSM1QunNStmVbk';
const bot = new TelegramBot(token, { polling: true });

// Foydalanuvchi holatlarini saqlash uchun
const userStates = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `🚀 *EduKontrol Academy* botiga xush kelibsiz!\n\nRo'yxatdan o'tish uchun F.I.O (Ism va Familiyangizni) kiriting:`, { parse_mode: 'Markdown' });
    userStates[chatId] = { step: 'waiting_name' };
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!userStates[chatId] || text.startsWith('/')) return;

    const state = userStates[chatId];

    if (state.step === 'waiting_name') {
        state.name = text;
        state.step = 'waiting_phone';
        bot.sendMessage(chatId, `Rahmat, ${state.name}!\nEndi telefon raqamingizni yuboring (masalan: +998 90 123 45 67):`);
    } 
    else if (state.step === 'waiting_phone') {
        state.phone = text;
        state.step = 'waiting_course';
        
        // Kurslarni tanlash uchun tugmalar
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💻 Frontend Dasturlash (React/JS)', callback_data: 'Frontend Dasturlash' }],
                    [{ text: '⚙️ Backend & Bot (Node.js)', callback_data: 'Backend & Bot' }],
                    [{ text: '🚀 Full-Stack Master Klass', callback_data: 'Full-Stack' }]
                ]
            }
        };
        bot.sendMessage(chatId, `Ta'lim yo'nalishini tanlang:`, opts);
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const course = query.data;
    const state = userStates[chatId];

    if (state && state.step === 'waiting_course') {
        state.course = course;

        // Arizani saqlash yoki bazaga yuborish amallarini shu yerda bajarasiz
        console.log("Yangi ariza:", state);

        const websiteUrl = 'https://diyorbekweb015.netlify.app/'; // Saytingiz manzili

        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💰 Kurslar Narxlari bilan Tanishish', url: websiteUrl }]
                ]
            }
        };

        bot.sendMessage(chatId, `✅ *Tabriklayman, ${state.name}!* \n\nArizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.\n\nKurslarning narxlari va batafsil ma'lumot bilan quyidagi tugma orqali tanishishingiz mumkin:`, { parse_mode: 'Markdown', ...opts });
        
        delete userStates[chatId];
    }
});
