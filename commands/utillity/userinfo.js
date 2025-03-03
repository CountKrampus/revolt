module.exports = {
    name: "userinfo",
    description: "Displays information about the user.",
    execute(client, message, args) {
        const user = message.author;
        message.reply(`👤 **User Info**\n- Username: ${user.username}\n- ID: ${user._id}`);
    }
};
