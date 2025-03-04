const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "withdraw",
    description: "Withdraw coins from your bank.",
    async execute(client, message, args) {
        console.log("[DEBUG] Message Object:", message); // Debug log

        const userId = message.author_id; // Correct for Revolt.js


        if (!userId) {
            return message.reply("❌ An error occurred while retrieving your user ID.");
        }

        // Get user wallet and bank balance
        let userBalance = (await db.get(`balance_${userId}`)) || 0;
        let userBank = (await db.get(`bank_${userId}`)) || 0;

        console.log(`[DEBUG] User ${userId} - Balance: ${userBalance}, Bank: ${userBank}`);

        let amount = args[0];

        // Handle "all" case
        if (amount === "all") {
            amount = userBank;
        } else {
            if (!amount || isNaN(amount) || amount <= 0) {
                return message.reply("❌ Please enter a valid amount to withdraw.");
            }
            amount = Number(amount);
        }

        if (amount > userBank) {
            return message.reply("❌ You don't have that many coins in your bank.");
        }

        // Update balances
        await db.set(`balance_${userId}`, userBalance + amount);
        await db.set(`bank_${userId}`, userBank - amount);

        console.log(`[✅] User ${userId} withdrew ${amount} coins. New Balance: ${userBalance + amount}, New Bank: ${userBank - amount}`);

        return message.reply(`✅ Successfully withdrew ${amount} coins.`);
    }
};
