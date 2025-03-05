const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { shopItems } = require("../../data/shopItems.js"); // Destructure to get the shopItems array

module.exports = {
    name: "buy",
    description: "Buy an item from the shop",
    execute: async (client, msg, args) => {
        if (!msg.channel.server_id) {
            return msg.channel.sendMessage("❌ This command can only be used in a server.");
        }

        const userId = msg.author?._id;
        if (!userId) {
            return msg.channel.sendMessage("❌ Could not retrieve user ID.");
        }

        const itemId = parseInt(args[0]);
        const item = shopItems.find(i => i.id === itemId);  // Use shopItems to find the item
        if (!item) {
            return msg.channel.sendMessage("❌ Invalid item ID. Use `!shop` to see available items.");
        }

        let userCoins = parseInt(await db.get(`balance_${userId}`)) || 0;
        if (userCoins < item.price) {
            return msg.channel.sendMessage(`❌ You don't have enough coins to buy **${item.name}**.`);
        }

        let newBalance = userCoins - item.price;
        await db.set(`balance_${userId}`, newBalance);

        let inventory = (await db.get(`inventory_${userId}`)) || [];
        let itemInInventory = inventory.find(i => i.id === itemId);

        if (itemInInventory) {
            itemInInventory.quantity += 1;
        } else {
            inventory.push({ id: itemId, name: item.name, quantity: 1 });
        }

        await db.set(`inventory_${userId}`, inventory);
        msg.channel.sendMessage(`✅ You bought **${item.name}** for **💵 ${item.price} coins**!`);
    }
};
