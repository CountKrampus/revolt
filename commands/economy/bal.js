const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "bal",
    description: "Check your balance",
    execute: async (client, message) => {
        let balance = await db.get(`balance_${message.author_id}`) || 0;
        await message.reply(`💵 Your balance: **${balance} coins**`);
    }
};
