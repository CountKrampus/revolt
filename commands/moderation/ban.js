require('regenerator-runtime/runtime');


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
            await server.banUser(userId);
            console.log(`[✅] Banned user: ${userId} in Server: ${serverId}`);
            message.reply(`✅ Successfully banned <@${userId}>.`);
        } catch (error) {
            console.error("[❌] Ban failed:", error);
            message.reply("❌ Failed to ban the user.");
        }
    },
};
