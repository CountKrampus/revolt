"use strict";

require('regenerator-runtime/runtime');

module.exports = {
  name: "ban",
  description: "Ban a user from the server.",
  execute: function execute(client, message, args, serverId) {
    var userId, server;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (serverId) {
              _context.next = 3;
              break;
            }

            console.log("[ERROR] No serverId available in ban command.");
            return _context.abrupt("return", message.reply("❌ This command can only be used in a server."));

          case 3:
            if (args[0]) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", message.reply("❌ Please mention a user to ban."));

          case 5:
            // Extract user ID from mention format <@userID>
            userId = args[0].replace(/[<@>]/g, "");
            _context.next = 8;
            return regeneratorRuntime.awrap(client.servers.fetch(serverId));

          case 8:
            server = _context.sent;

            if (server) {
              _context.next = 12;
              break;
            }

            console.log("[ERROR] Server not found:", serverId);
            return _context.abrupt("return", message.reply("❌ Could not find the server."));

          case 12:
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(server.banUser(userId));

          case 15:
            console.log("[\u2705] Banned user: ".concat(userId, " in Server: ").concat(serverId));
            message.reply("\u2705 Successfully banned <@".concat(userId, ">."));
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](12);
            console.error("[❌] Ban failed:", _context.t0);
            message.reply("❌ Failed to ban the user.");

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[12, 19]]);
  }
};