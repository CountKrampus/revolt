const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "deposit",
    description: "Deposit coins into your bank.",
    async execute(client, message, args) {
        console.log("[DEBUG] Message Object:", message); // Debug log

        const userId = message.author_id; // Correct for Revolt.js
 

        if (!userId) {
            return message.reply("❌ An error occurred while retrieving your user ID.");
        }

        // Fetch current balance from the database
        let userBalance = (await db.get(`balance_${userId}`)) || 0;
        let userBank = (await db.get(`bank_${userId}`)) || 0;

        console.log(`[DEBUG] User ${userId} - Balance: ${userBalance}, Bank: ${userBank}`);

        // Validate the amount
        let amount = args[0];
        if (!amount || isNaN(amount) || amount <= 0) {
            return message.reply("❌ Please enter a valid amount to deposit.");
        }
        amount = Number(amount);

        if (amount > userBalance) {
            return message.reply(`❌ You don't have enough coins. You only have ${userBalance} coins.`);
        }

        // Perform deposit
        await db.set(`balance_${userId}`, userBalance - amount);
        await db.set(`bank_${userId}`, userBank + amount);

        console.log(`[✅] User ${userId} deposited ${amount} coins. New Balance: ${userBalance - amount}, New Bank: ${userBank + amount}`);

        return message.reply(`✅ Successfully deposited ${amount} coins into your bank.`);
    }
};
