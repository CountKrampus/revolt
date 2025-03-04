const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "sell",
    description: "Sell an item from your inventory.",
    async execute(client, msg, args) {
        if (!args[0]) return msg.channel.sendMessage("❌ Please specify an item ID to sell.");

        const userId = msg.author?._id;

        console.log(`DEBUG: msg.author →`, msg.author);
        console.log(`DEBUG: Resolved userId → ${userId}`);
        
        if (!userId) {
            return msg.channel.sendMessage("❌ Could not retrieve user ID.");
        }   

        const itemId = parseInt(args[0]); // Convert input to number

        // Fetch inventory
        let inventory = (await db.get(`inventory_${userId}`)) || [];
        console.log(`User Inventory for ${userId}:`, inventory); // Debugging

        // Fetch shop items
        let shop = (await db.get("shop")) || [];
        console.log(`Shop Items:`, shop); // Debugging

        // Ensure the shop exists
        if (!shop || shop.length === 0) {
            return msg.channel.sendMessage("❌ The shop is not set up yet.");
        }

        // Find the item in the shop
        const item = shop.find(i => i.id === itemId);
        if (!item) return msg.channel.sendMessage("❌ That item doesn't exist in the shop.");

        // Find the item in the user's inventory
        const itemIndex = inventory.findIndex(i => i.id === itemId);

        if (itemIndex === -1) return msg.channel.sendMessage("❌ You don't own that item.");

        // Remove item from inventory (handle quantity)
        if (inventory[itemIndex].quantity > 1) {
            inventory[itemIndex].quantity -= 1;
        } else {
            inventory.splice(itemIndex, 1);
        }

        await db.set(`inventory_${userId}`, inventory);

        // ✅ Give the user coins (50% of item price)
        const sellPrice = Math.floor(item.price * 0.5);
        await db.add(`balance_${userId}`, sellPrice);

        msg.channel.sendMessage(`✅ You sold **${item.name}** for **💵 ${sellPrice} coins**!`);
    }
};
