const { polls } = require("./poll"); // Import polls

module.exports = {
    name: "pollresults",
    description: "Check results of an active poll",
    execute: async (client, message, args, serverId) => {
        if (!polls) return message.reply("❌ Poll system is not initialized!");

        const pollId = args[0];

        if (!pollId || !polls.has(pollId)) return message.reply("❌ Invalid poll ID!");

        const poll = polls.get(pollId);

        // Create an embed for the poll results
        const embed = {
            type: "Text",
            title: "📊 Poll Results",
            description: `**Poll Question:**\n${poll.question}\n\n✅ **Yes Votes:** ${poll.yes}\n❌ **No Votes:** ${poll.no}`,
            color: "#3498db" // Blue color
        };

        // Send the embed
        message.channel.sendMessage({ content: "", embed });
    }
};
