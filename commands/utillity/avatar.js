module.exports = {
    name: "avatar",
    description: "Get the avatar of a user",
    async execute(client, message, args) {
        try {
            console.log("Message Object:", message);
            console.log("Message Author:", message.author);

            const userId = message.mention_ids?.[0] || message.author?._id;

            if (!userId) {
                return message.reply("User ID not found!");
            }

            const user = await client.users.fetch(userId);

            if (!user) {
                return message.reply("User not found!");
            }

            const avatarUrl = user.avatar?._id 
                ? `https://autumn.revolt.chat/avatars/${user.avatar._id}`
                : "No avatar found.";

            message.reply(`Here is ${user.username || "Unknown"}'s avatar: ${avatarUrl}`);
        } catch (error) {
            console.error("Error fetching avatar:", error);
            message.reply("An error occurred while fetching the avatar.");
        }
    }
};
