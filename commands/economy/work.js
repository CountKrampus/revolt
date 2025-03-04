const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "work",
    description: "Earn coins by working",
    execute: async (client, message) => {
        let earnings = Math.floor(Math.random() * 200) + 50;
        await db.add(`balance_${message.author_id}`, earnings);

        await message.reply(`🛠️ You worked and earned **${earnings} coins**!`);
    }
};
