const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "bank",
    description: "Check your bank balance",
    async execute(client, message) {
        const userId = message.author_id; // Correct ID usage for Revolt.js

        let bankBalance = (await db.get(`bank_${userId}`)) || 0;

        await message.reply(`🏦 Your bank balance: **${bankBalance} coins**`);
    }
};
