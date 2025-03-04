const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "richest",
    description: "Show the top 10 richest users.",
    async execute(client, msg) {
        console.log("[DEBUG] Richest command executed by:", msg.author?.username || "Unknown");

        try {
            const allKeys = await db.all();
            const userBalances = [];

            // Extract balance and bank data
            for (const entry of allKeys) {
                const key = entry.id;
                if (key.startsWith("balance_")) {
                    const userId = key.replace("balance_", "");
                    const balance = await db.get(`balance_${userId}`) || 0;
                    const bank = await db.get(`bank_${userId}`) || 0;
                    userBalances.push({ userId, total: balance + bank });
                }
            }

            // Sort users by total wealth (highest to lowest)
            userBalances.sort((a, b) => b.total - a.total);

            // Build leaderboard description
            let description = userBalances.length > 0 ? "" : "No users found.";
            for (let i = 0; i < Math.min(userBalances.length, 10); i++) {
                const user = await client.users.fetch(userBalances[i].userId).catch(() => null);
                const username = user ? user.username : `Unknown User (${userBalances[i].userId})`;
                description += `**#${i + 1}** ${username} - 💰 **${userBalances[i].total} coins**\n`;
            }

            // Construct the embed
            const embed = {
                type: "Text",
                title: "🏆 Richest Users",
                description,
                colour: "#FFD700" // Gold color
            };

            console.log("[DEBUG] Embed constructed successfully:", embed);

            // Send the embed message
            msg.channel.sendMessage({ embeds: [embed] })
                .then(() => console.log("[DEBUG] Embed sent successfully"))
                .catch(err => {
                    console.error("[ERROR] Failed to send embed:", err);
                    msg.channel.sendMessage("❌ Error: Failed to send the richest list.");
                });
        } catch (error) {
            console.error("[ERROR] Exception in richest command:", error);
            msg.channel.sendMessage("❌ Error: An unexpected issue occurred while processing the command.");
        }
    }
};
