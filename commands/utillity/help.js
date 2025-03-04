module.exports = {
    name: "help",
    description: "Lists all available commands",
    execute(client, msg, args) {
        console.log("[DEBUG] Help command executed by:", msg.author?.username || "Unknown");

        try {
            // Categorized command list
            const categories = {
                "🎲 Fun": [
                    "`coinflip` - Flips a coin and returns heads or tails.",
                    "`dice` - Rolls a 6-sided dice."
                ],
                "🔨 Moderation": [
                    "`kick` - Kicks a member from the server.",
                    "`ban` - Bans a member from the server. (Being worked on)"
                ],
                "📜 Utility": [
                    "`avatar` - Get the avatar of a user.",
                    "`help` - Lists all available commands.",
                    "`ping` - Replies with Pong!",
                    "`serverinfo` - Displays information about the server.",
                    "`userinfo` - Displays information about the user."
                ],
                "💰 Economy": [
                    "`bal` - Check your balance.",
                    "`bank` - Check your bank balance.",
                    "`daily` - Claim your daily reward",
                    "`richest` - Show the top 10 richest users..",
                    "`withdraw` - Withdraw coins from your bank..",
                    "`deposit` - Deposit coins into your bank.",
                    "`work` - Earn coins by working."
                ]
            };

            // Construct the embed description
            let description = "Here are my available commands:\n\n";
            for (const [category, commands] of Object.entries(categories)) {
                description += `**${category}**\n${commands.join("\n")}\n\n`;
            }
            description += "Use `!help <command>` for more details.";

            // Construct the embed
            const embed = {
                type: "Text",
                title: "🤖 Command List",
                description,
                colour: "#5865F2" // Hex color
            };

            console.log("[DEBUG] Embed constructed successfully:", embed);

            // Send the embed message
            msg.channel.sendMessage({ embeds: [embed] })
                .then(() => console.log("[DEBUG] Embed sent successfully"))
                .catch(err => {
                    console.error("[ERROR] Failed to send embed:", err);
                    msg.channel.sendMessage("❌ Error: Failed to send the help message.");
                });
        } catch (error) {
            console.error("[ERROR] Exception in help command:", error);
            msg.channel.sendMessage("❌ Error: An unexpected issue occurred while processing the command.");
        }
    }
};
