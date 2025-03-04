const ms = require("ms");

module.exports = {
    name: "remindme",
    description: "Set a reminder",
    execute: async (client, msg, args) => {
        // ✅ Prevent bot from triggering itself
        if (msg.author_id === client.user.id) return;

        // ✅ Ensure command is only used in servers
        if (!msg.channel.server_id) {
            return msg.channel.sendMessage("❌ This command can only be used in a server.");
        }

        // ✅ Validate arguments
        if (args.length < 2) {
            return msg.channel.sendMessage("❌ Usage: `!remindme <time> <message>`");
        }

        // ✅ Parse time
        const time = ms(args[0]);
        if (!time || time < 1000) {
            return msg.channel.sendMessage("❌ Invalid time format! Example: `10s`, `5m`, `1h`");
        }

        // ✅ Get reminder message
        const reminderMessage = args.slice(1).join(" ");

        // ✅ Confirm reminder set
        msg.channel.sendMessage(`✅ Reminder set for **${args[0]}**: "${reminderMessage}"`);

        // ✅ Set reminder with timeout
        setTimeout(() => {
            msg.channel.sendMessage(`⏰ **Reminder:** <@${msg.author_id}>, "${reminderMessage}"`);
        }, time);
    }
};
