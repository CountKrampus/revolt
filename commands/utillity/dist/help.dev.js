"use strict";

module.exports = {
  name: "help",
  description: "Lists all available commands",
  execute: function execute(client, msg, args) {
    var embed = {
      type: "Text",
      title: "🤖 Command List",
      description: "Here are my available commands:\n\nUse `!help <command>` for more details.",
      colour: "#5865F2",
      // Hex color
      fields: [{
        name: "🎲 Fun Commands",
        value: "`coinflip` - Flips a coin.\n`dice` - Rolls a dice."
      }, {
        name: "🛠️ Utility Commands",
        value: "`avatar` - Get a user's avatar.\n`ping` - Replies with Pong!"
      }, {
        name: "⚙️ Moderation Commands",
        value: "`kick` - Kicks a member."
      }, {
        name: "ℹ️ Info Commands",
        value: "`serverinfo` - Server details.\n`userinfo` - Your profile info."
      }]
    }; // Send the embed message properly

    msg.channel.sendMessage({
      embeds: [embed]
    })["catch"](console.error);
  }
};