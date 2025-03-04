const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "daily",
    description: "Claim your daily reward",
    execute: async (client, message) => {
        let lastClaimed = await db.get(`daily_${message.author_id}`) || 0;
        let now = Date.now();

        if (now - lastClaimed < 86400000) { // 24 hours
            return message.reply("❌ You can only claim daily rewards once every 24 hours.");
        }

        let reward = 100;
        await db.add(`balance_${message.author_id}`, reward);
        await db.set(`daily_${message.author_id}`, now);

        await message.reply(`✅ You received **${reward} coins** as your daily reward!`);
    }
};
