const polls = new Map(); // Store active polls

module.exports = {
    name: "poll",
    description: "Creates a poll for the server",
    polls, // Export the polls map
    execute: async (client, message, args, serverId) => {
        try {
            const question = args.join(" ");
            if (!question) return message.reply("❌ Please provide a question for the poll.");

            const pollId = Date.now().toString(); // Unique poll ID
            polls.set(pollId, { question, yes: 0, no: 0 });

            await message.channel.sendMessage(
                `📊 **Poll:** ${question}\n\nVote using: ` +
                "`!vote yes <pollId>` or `!vote no <pollId>`\nPoll ID: `" + pollId + "`"
            );

        } catch (error) {
            console.error("[ERROR] poll command failed:", error);
            message.reply("❌ There was an error while creating the poll.");
        }
    },
};
