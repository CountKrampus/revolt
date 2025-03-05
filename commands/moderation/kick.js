module.exports = {
    name: "kick",
    description: "Kicks a member from the server.",
    async execute(client, message, args) {
        if (!message.guild) {
            return message.reply("❌ This command can only be used in a server.");
        }

        // Ensure the bot itself has permission (TEMPORARY FIX)
        const botMember = await client.api.get(`/guilds/${message.guild.id}/members/${client.user.id}`);
        if (!botMember) {
            return message.reply("❌ I cannot verify my own permissions.");
        }

        // Ensure the user has a mod role
        const { modRoles } = require("../../data/roles"); // Import mod roles from modRoles.js
        const member = await client.api.get(`/guilds/${message.guild.id}/members/${message.author.id}`);
        
        const isMod = member.roles.some(roleId => {
            const role = message.guild.roles.get(roleId); // Ensure you are getting the roles correctly from guild
            return role && modRoles.includes(role.name); // Check if the user has a mod role
        });

        if (!isMod) {
            return message.reply("❌ You need a moderator role to kick members.");
        }

        // Get mentioned user
        const user = message.mentions.users.first(); 
        if (!user) {
            return message.reply("❌ Please mention a user to kick.");
        }

        try {
            // Fetch the member from API
            const targetMember = await client.api.get(`/guilds/${message.guild.id}/members/${user.id}`);

            if (!targetMember) {
                return message.reply("❌ User is not a member of this server.");
            }

            // Kick the user via API
            await client.api.delete(`/guilds/${message.guild.id}/members/${user.id}`);
            message.reply(`✅ Successfully kicked <@${user.id}>.`);
        } catch (error) {
            console.error("Error kicking member:", error);
            message.reply("❌ Failed to kick the user.");
        }
    }
};
