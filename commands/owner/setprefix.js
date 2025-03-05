const { QuickDB } = require("quick.db");
const db = new QuickDB();
const adminRoleNames = require("../../data/adminRoles.js"); // Move up two levels


module.exports = {
    name: "setprefix",
    description: "Set a custom command prefix for this server.",
    execute: async (client, msg, args) => {
        try {
            const senderId = msg.author_id;
            const serverId = msg.channel.server_id;

            // Fetch server
            const server = await client.servers.fetch(serverId);
            const senderMember = await server.fetchMember(senderId);
            const senderRoles = senderMember.roles || [];

            // Check if the sender has any of the admin roles
            const isAdmin = senderRoles.some(roleId => {
                const role = server.roles[roleId]; // ✅ Correct way to access roles in Revolt.js
                return role && adminRoleNames.includes(role.name);
            });

            if (!isAdmin) {
                return msg.channel.sendMessage("❌ You need **Administrator** permissions to change the prefix.");
            }

            // Validate Prefix Input
            const newPrefix = args[0];
            if (!newPrefix) {
                return msg.channel.sendMessage("❌ Please provide a new prefix. Example: `!setprefix ?`");
            }
            if (newPrefix.length > 3) {
                return msg.channel.sendMessage("❌ Prefix cannot be longer than 3 characters.");
            }

            // Save the Prefix
            await db.set(`prefix_${serverId}`, newPrefix);
            msg.channel.sendMessage(`✅ The prefix has been updated to: \`${newPrefix}\``);

        } catch (error) {
            console.error("[ERROR] Failed to process setprefix command:", error);
            msg.channel.sendMessage("❌ An error occurred while setting the prefix.");
        }
    }
};
