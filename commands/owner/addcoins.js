const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "addcoins",
    description: "Admin-only: Add coins to a user's balance",
    execute: async (client, msg, args) => {
        try {
            const senderId = msg.author_id;
            const mentionedUser = msg.mention_ids?.[0]; // Get mentioned user
            const amount = parseInt(args[1]);

            // Fetch server
            const serverId = msg.channel.server_id;
            const server = await client.servers.fetch(serverId);
            const senderMember = await server.fetchMember(senderId);
            const senderRoles = senderMember.roles || [];

            // Define your admin role name
            const adminRoleName = "⚜️ Admin";

            // Check if the sender has the admin role (Fixed)
            const isAdmin = senderRoles.some(roleId => {
                const role = server.roles[roleId]; // ✅ Correct way to access roles in Revolt.js v6
                return role && role.name === adminRoleName;
            });

            if (!isAdmin) {
                return msg.channel.sendMessage("❌ You must be an admin to use this command.");
            }

            // Error Handling
            if (!mentionedUser) {
                return msg.channel.sendMessage("❌ Please mention a user to add coins to.");
            }
            if (isNaN(amount) || amount <= 0) {
                return msg.channel.sendMessage("❌ Please enter a valid amount.");
            }

            // Fetch and Update Balance
            let userBalance = await db.get(`balance_${mentionedUser}`) || 0;
            let newBalance = userBalance + amount;
            await db.set(`balance_${mentionedUser}`, newBalance);

            // Create Embed
            const embed = {
                type: "Text",
                title: "💰 Coins Added!",
                description: `Admin <@${senderId}> added **${amount} coins** to <@${mentionedUser}>'s balance!\n\n🪙 **New Balance:** ${newBalance} coins`,
                colour: "#FFD700"
            };

            // Send Response
            msg.channel.sendMessage({ embeds: [embed] });
        } catch (error) {
            console.error("[ERROR] Failed to process addcoins command:", error);
            msg.channel.sendMessage("❌ An error occurred while adding coins.");
        }
    }
};
