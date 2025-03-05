const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "slotmachine",
    description: "Play the slot machine and try to win coins!",
    category: "Fun",
    execute: async (client, msg, args) => {
        try {
            // Get the user's current coin balance
            const userId = msg.author_id;
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
