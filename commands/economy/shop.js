const { QuickDB } = require("quick.db");
const db = new QuickDB(); // Initialize the db instance

module.exports = {
    name: "shop",
    description: "Browse the shop for items",
    execute: async (client, msg, args) => {
        if (!msg.channel.server_id) {
            return msg.channel.sendMessage("❌ This command can only be used in a server.");
        }

        // Fetch the shop data from the database
        const shop = await db.get("shop");

        if (!shop || shop.length === 0) {
            return msg.channel.sendMessage("❌ The shop has not been set up.");
        }

        // Create the item list for the shop
        const itemList = shop.map(item => `**${item.id}.** ${item.name} - 💵 ${item.price} coins`).join("\n");

        const embed = {
            type: "Text",
            title: "🛒 Shop",
            description: `Use \`!buy <item_id>\` to purchase an item.\n\n${itemList}`,
            colour: "#00FF00"
        };

        msg.channel.sendMessage({ embeds: [embed] });
    }
};
