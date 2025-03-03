module.exports = {
    name: "ping",
    description: "Replies with Pong!",
    execute(client, message, args) {
        message.reply("Pong!");
    }
};
