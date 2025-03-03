module.exports = {
    name: "dice",
    description: "Rolls a 6-sided dice.",
    execute(client, message, args) {
        const roll = Math.floor(Math.random() * 6) + 1;
        message.reply(`🎲 You rolled a **${roll}**!`);
    }
};
