const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { premiumRoles } = require("../../data/roles"); // Import the premiumRoles array from roles.js

module.exports = {
    name: "2slotmachine",
    description: "Play the slot machine and try to win coins!",
    category: "Fun",
    execute: async (client, msg, args) => {
        try {
            // Fetch server ID from the message
            const serverId = msg.channel.server_id;
            const server = await client.servers.fetch(serverId); // Fetch the server by its ID
            if (!server) {
                return msg.reply("❌ Unable to find the server.");
            }

            // Fetch the member's data using the member's ID
            const senderId = msg.author.id;
            const senderMember = await server.members.get(senderId); // Get member from the server
            if (!senderMember) {
                return msg.reply("❌ Unable to find your member profile.");
            }

            // Get the sender's roles (Revolt-specific)
            const senderRoles = senderMember.roles || []; // Roles are stored directly on the member object
            
            // Check if the sender has a Premium role
            const hasPremiumRole = senderRoles.some(roleId => {
                // Fetch the role by ID from server.roles
                const role = server.roles.get(roleId); 
                return role && premiumRoles.includes(role.name); // Check if role is in premiumRoles
            });

            if (!hasPremiumRole) {
                return msg.reply("❌ You need a 'Premium' role to play the slot machine.");
            }

            // Get the user's current coin balance
            const userId = msg.author.id;
            let userCoins = await db.get(`balance_${userId}`);
            if (!userCoins) userCoins = 0;

            // Slot machine costs 50 coins per spin
            const spinCost = 50;
            if (userCoins < spinCost) {
                return msg.channel.sendMessage(`❌ You don't have enough coins to play. You need ${spinCost} coins to spin.`);
            }

            // Deduct the coins from the user's balance
            userCoins -= spinCost;
            await db.set(`balance_${userId}`, userCoins);

            // Slot machine symbols
            const symbols = ["🍒", "🍋", "🍉", "🍇", "🍊", "🍓"];
            
            // Randomly select three symbols for the spin
            const spinResult = [];
            for (let i = 0; i < 3; i++) {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                spinResult.push(randomSymbol);
            }

            // Determine if the user won
            const [symbol1, symbol2, symbol3] = spinResult;
            let resultMessage = `🎰 **Slot Machine Spin!** 🎰\n`;
            resultMessage += `Your spin: ${symbol1} | ${symbol2} | ${symbol3}\n`;

            if (symbol1 === symbol2 && symbol2 === symbol3) {
                // Win: 3 matching symbols
                const prize = spinCost * 2; // Double the cost as the prize
                userCoins += prize;
                await db.set(`balance_${userId}`, userCoins);
                resultMessage += `🎉 **You win!** 🎉\nYou earned ${prize} coins!`;
            } else {
                // Loss
                resultMessage += `😞 **You lose.** Better luck next time!`;
            }

            // Send the result message
            msg.channel.sendMessage(resultMessage);
        } catch (error) {
            console.error("[ERROR] Failed to execute slot machine command:", error);
            msg.channel.sendMessage("❌ An error occurred while processing the command.");
        }
    }
};
