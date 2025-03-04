const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "removecoins",
    description: "Removes coins from a user's balance (Admin only)",
    category: "Owner",
    execute: async (client, msg, args) => {
        console.log("[COMMAND] Executing: removecoins");

        try {
            // Define your admin role ID manually (get it from your server settings)
            const adminRoleId = "01JNG10M14VT9M2H60ZVZDA3AN"; // Change this!

            // Fetch the server and member
            const server = await client.servers.fetch(msg.channel.server_id);
            const member = await server.fetchMember(msg.author_id);

            // Debugging: Log member's roles
            console.log(`[DEBUG] Member Roles: ${member.roles.join(", ")}`);

            // Check if the user has the admin role
            if (!member || !member.roles.includes(adminRoleId)) {
                return msg.channel.sendMessage("❌ You must be an admin to use this command.");
            }

            // Validate arguments
            const targetUser = args[0]?.replace(/[<@>]/g, ""); // Extract user ID from mention
            const amount = parseInt(args[1], 10);

            if (!targetUser || isNaN(amount) || amount <= 0) {
                return msg.channel.sendMessage("❌ Invalid usage! Correct format: `!removecoins @user <amount>`");
            }

            // Fetch target user's balance
            let balance = await db.get(`balance_${targetUser}`) || 0;

            if (balance < amount) {
                return msg.channel.sendMessage("❌ The user doesn't have enough coins to remove.");
            }

            // Remove coins and update the database
            await db.set(`balance_${targetUser}`, balance - amount);

            console.log(`[DEBUG] Removed ${amount} coins from ${targetUser}. New balance: ${balance - amount}`);

            // Send confirmation message
            msg.channel.sendMessage(`✅ Successfully removed **${amount} coins** from <@${targetUser}>'s balance.`);
        } catch (error) {
            console.error("[ERROR] Failed to process removecoins command:", error);
            msg.channel.sendMessage("❌ An error occurred while processing the command.");
        }
    }
};
