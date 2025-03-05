const { polls } = require("./poll"); // Import polls from poll.js

module.exports = {
    name: "vote",
    description: "Vote in an active poll",
    execute: async (client, message, args, serverId) => {
        try {
            if (!polls) return message.reply("❌ Poll system is not initialized!");

            const vote = args[0]?.toLowerCase();
            const pollId = args[1];

            if (!pollId || !polls.has(pollId)) return message.reply("❌ Invalid poll ID!");
            if (vote !== "yes" && vote !== "no") return message.reply("❌ Please vote with `yes` or `no`!");

            const poll = polls.get(pollId);
            poll[vote]++;
            polls.set(pollId, poll);

            // Create a valid embed structure for Revolt.js
            const embed = {
                type: "Text",
                title: "🗳️ Vote Recorded",
                description: `✅ **You voted:** \`${vote.toUpperCase()}\`\n\n📊 **Current Votes:**\n✔️ **Yes:** ${poll.yes}\n❌ **No:** ${poll.no}`,
                colour: vote === "yes" ? "#2ecc71" : "#e74c3c" // Color format correction
            };

            // Use `message.reply` instead of `message.channel.sendMessage`
            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("[ERROR] vote command failed:", error);
            message.reply("❌ An error occurred while processing your vote.");
        }
    }
};
