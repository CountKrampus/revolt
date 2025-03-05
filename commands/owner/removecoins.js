const { QuickDB } = require("quick.db");
const { adminRoles } = require("../../data/roles.js"); // Destructure to get adminRoles
const db = new QuickDB();

module.exports = {
    name: "removecoins",
    description: "Removes coins from a user's balance (Admin only)",
    category: "Owner",
    execute: async (client, msg, args) => {
        console.log("[COMMAND] Executing: removecoins");

        try {
            const senderId = msg.author_id;
            const mentionedUser = msg.mention_ids?.[0]; // Get mentioned user

            // Fetch server
            const serverId = msg.channel.server_id;
            const server = await client.servers.fetch(serverId);
            const senderMember = await server.fetchMember(senderId);
            const senderRoles = senderMember.roles || [];

            if (!senderMember) {
                return msg.channel.sendMessage("❌ Could not fetch member.");
            }

            // Debugging: Log sender's roles
            console.log(`[DEBUG] Sender Roles: ${senderRoles.join(", ")}`);

            // Check if the sender has any of the admin roles
            const isAdmin = senderRoles.some(roleId => {
                const role = server.roles[roleId]; // Correct way to access roles in Revolt.js
                return role && adminRoles.includes(role.name); // Using adminRoles from roles.js
            });

            if (!isAdmin) {
                return msg.channel.sendMessage("❌ You must be an admin to use this command.");
            }

            // Validate arguments
            const targetUser = mentionedUser?.replace(/[<@>]/g, ""); // Extract user ID from mention
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
