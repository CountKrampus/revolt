module.exports = {
    name: "kick",
    description: "Kicks a member from the server.",
    async execute(client, message, args) {
        if (!message.channel.server) {
            return message.reply("❌ This command can only be used in a server.");
        }

        // Ensure the bot itself has permission (TEMPORARY FIX)
        const botMember = await client.api.get(`/servers/${message.channel.server._id}/members/${client.user._id}`);
        if (!botMember) {
            return message.reply("❌ I cannot verify my own permissions.");
        }

        // Get mentioned user
        const user = message.mention_ids?.[0]; 
        if (!user) {
            return message.reply("❌ Please mention a user to kick.");
        }

        try {
            // Fetch the member from API
            const member = await client.api.get(`/servers/${message.channel.server._id}/members/${user}`);

            if (!member) {
                return message.reply("❌ User is not a member of this server.");
            }

            // Kick the user via API
            await client.api.delete(`/servers/${message.channel.server._id}/members/${user}`);
            message.reply(`✅ Successfully kicked <@${user}>.`);
        } catch (error) {
            console.error("Error kicking member:", error);
            message.reply("❌ Failed to kick the user.");
        }
    }
};
