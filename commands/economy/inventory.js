const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    name: "inventory",
    description: "Check your inventory",
    execute: async (client, msg, args) => {
        // ✅ Ensure the command is used in a server
        if (!msg.channel.server_id) {
            return msg.channel.sendMessage("❌ This command can only be used in a server.");
        }

        const userId = msg.author_id;

        // ✅ Fetch inventory from QuickDB (default to empty array if not found)
        const inventory = await db.get(`inventory_${userId}`) || [];

        // ✅ Check if inventory is empty
        if (inventory.length === 0) {
            return msg.channel.sendMessage("🎒 Your inventory is empty! Earn items to fill it up.");
        }

        // ✅ Format inventory list
        const itemList = inventory.map((item, index) => `**${index + 1}.** ${item.name} (${item.quantity})`).join("\n");

        // ✅ Send the embed message
        const embed = {
            type: "Text",
            title: `🎒 ${msg.author.username}'s Inventory`,
            description: itemList,
            colour: "#FFD700" // Gold color
        };

        msg.channel.sendMessage({ embeds: [embed] });
    }
};
