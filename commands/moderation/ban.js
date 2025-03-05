require('regenerator-runtime/runtime');
const { adminRoles } = require("../../data/roles.js"); // Import adminRoles from roles.js

module.exports = {
    name: "ban",
    description: "Ban a user from the server.",
    async execute(client, message, args, serverId) {
        if (!serverId) {
            console.log("[ERROR] No serverId available in ban command.");
            return message.reply("❌ This command can only be used in a server.");
        }

        if (!args[0]) return message.reply("❌ Please mention a user to ban.");

        // Extract user ID from mention format <@userID>
        const userId = args[0].replace(/[<@>]/g, "");
        const server = await client.servers.fetch(serverId);

        if (!server) {
            console.log("[ERROR] Server not found:", serverId);
            return message.reply("❌ Could not find the server.");
        }

        try {
            // Fetch the sender (author) to check if they have an admin role
            const member = await server.fetchMember(message.author_id);

            // Check if the sender has any of the admin roles
            const isAdmin = member.roles.some(roleId => {
                const role = server.roles[roleId];
                return role && adminRoles.includes(role.name); // Check for admin role
            });

            if (!isAdmin) {
                return message.reply("❌ You need an admin role to ban users.");
            }

            // Proceed with banning the user
            await server.banUser(userId);
            console.log(`[✅] Banned user: ${userId} in Server: ${serverId}`);
            message.reply(`✅ Successfully banned <@${userId}>.`);
        } catch (error) {
            console.error("[❌] Ban failed:", error);
            message.reply("❌ Failed to ban the user.");
        }
    },
};
