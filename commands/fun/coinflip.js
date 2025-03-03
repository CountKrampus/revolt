module.exports = {
    name: "coinflip",
    description: "Flips a coin and returns heads or tails.",
    execute(client, message, args) {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        message.reply(`🪙 The coin landed on **${result}**!`);
    }
};
