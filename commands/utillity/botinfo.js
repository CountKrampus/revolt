// botinfo.js
module.exports = {
    name: "botinfo",
    description: "Displays information about the bot",
    category: "Misc",
    execute: async (client, message, args, serverId) => {
        try {
            // Create the embed structure with everything in the description
            const embed = {
                color: "#0099ff", // Customize the color as desired
                title: "Information about Krampus-Jr.",
                description: `
                    **Bot Name**: Krampus-Jr.
                    **Creator**: <@01JN7DG0BV48DT3QBM5JX9NAS6>
                    **GitHub**: [GitHub Link](https://github.com/CountKrampus/revolt)
                    
                    **Version**: 1.0.0
                    
                    More features coming soon!
                `,
                footer: {
                    text: "Bot Information",
                },
                timestamp: new Date(),
            };

            // Send the embed as a reply
            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("[ERROR] botinfo command failed:", error);
            message.reply("❌ There was an error while fetching bot info.");
        }
    },
};
