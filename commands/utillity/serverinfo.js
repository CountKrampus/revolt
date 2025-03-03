module.exports = {
    name: "serverinfo",
    description: "Displays information about the server.",
    async execute(client, message, args) {
        if (!message.channel.server) {
            return message.reply("❌ This command can only be used in a server.");
        }

        const server = message.channel.server;

        try {
            // Fetch a list of users in the current channel
            const channelMembers = await message.channel.fetchMembers();
            
            message.reply(`📜 **Server Info**\n- Name: ${server.name}\n- Members: ${channelMembers.size}`);
        } catch (error) {
            console.error("Error fetching channel members:", error);
            message.reply(`📜 **Server Info**\n- Name: ${server.name}\n- Members: (Could not fetch)`);
        }
    }
};
