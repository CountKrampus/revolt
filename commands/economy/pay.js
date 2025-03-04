const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "pay",
    description: "Send coins to another user",
    execute: async (client, msg, args) => {
        try {
            const senderId = msg.author_id;
            const mentionedUser = msg.mention_ids?.[0]; // Get the mentioned user ID
            const amount = parseInt(args[1]);

            // Error Handling
            if (!mentionedUser) {
                return msg.channel.sendMessage("❌ Please mention a user to send coins to.");
            }
            if (isNaN(amount) || amount <= 0) {
                return msg.channel.sendMessage("❌ Please enter a valid amount.");
            }
            if (mentionedUser === senderId) {
                return msg.channel.sendMessage("❌ You can't send coins to yourself.");
            }

            // Fetch Balances
            let senderBalance = await db.get(`balance_${senderId}`) || 0;
            let recipientBalance = await db.get(`balance_${mentionedUser}`) || 0;

            if (senderBalance < amount) {
                return msg.channel.sendMessage(`❌ You don't have enough coins! Your balance: **${senderBalance} coins**`);
            }

            // Transfer Coins
            await db.set(`balance_${senderId}`, senderBalance - amount);
            await db.set(`balance_${mentionedUser}`, recipientBalance + amount);

            // Create Embed
            const embed = {
                type: "Text",
                title: "💸 Payment Successful!",
                description: `<@${senderId}> sent **${amount} coins** to <@${mentionedUser}>!`,
                colour: "#00FF00"
            };

            // Send Response
            msg.channel.sendMessage({ embeds: [embed] });
        } catch (error) {
            console.error("[ERROR] Failed to process pay command:", error);
            msg.channel.sendMessage("❌ An error occurred while processing the transaction.");
        }
    }
};
