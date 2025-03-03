"use strict";

var _require = require("revolt.js"),
    Client = _require.Client;

var fs = require("fs");

var path = require("path");

require('dotenv').config();

var client = new Client(); // No cache option

client.commands = new Map(); // Load Commands Function

var loadCommands = function loadCommands(dir) {
  if (!fs.existsSync(dir)) {
    console.error("[ERROR] Commands folder not found:", dir);
    return;
  }

  var commandFiles = fs.readdirSync(dir);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = commandFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;
      var fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        loadCommands(fullPath); // Recursively load subdirectories
      } else if (file.endsWith(".js")) {
        try {
          var command = require(fullPath);

          if (command.name && typeof command.execute === "function") {
            client.commands.set(command.name, command);
            console.log("[\u2705] Loaded command: ".concat(command.name));
          } else {
            console.warn("[\u26A0\uFE0F] Skipping invalid command file: ".concat(file));
          }
        } catch (err) {
          console.error("[\u274C] Error loading command file: ".concat(file), err);
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}; // Load commands from "commands" folder


var commandsPath = path.join(__dirname, "commands");
loadCommands(commandsPath); // Message Listener

client.on("message", function _callee(message) {
  var serverId, channel, args, commandName;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!message || !message.content)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          if (message.content.startsWith("!")) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return");

        case 4:
          console.log("[DEBUG] Raw message object:", message);
          serverId = message.serverId; // Check if serverId exists
          // If serverId is missing, fetch it from the channel

          if (!(!serverId && message.channel_id)) {
            _context.next = 17;
            break;
          }

          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(client.api.get("/channels/".concat(message.channel_id)));

        case 10:
          channel = _context.sent;

          if (channel && channel.server) {
            serverId = channel.server; // Assign manually

            console.log("[FIX] Found serverId from channel: ".concat(serverId));
          }

          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](7);
          console.error("[ERROR] Failed to fetch channel data:", _context.t0);

        case 17:
          if (serverId) {
            _context.next = 20;
            break;
          }

          console.log("[ERROR] Still no serverId available.");
          return _context.abrupt("return", message.reply("❌ This command can only be used in a server."));

        case 20:
          args = message.content.slice(1).trim().split(/ +/);
          commandName = args.shift().toLowerCase();

          if (!client.commands.has(commandName)) {
            _context.next = 33;
            break;
          }

          _context.prev = 23;
          console.log("[COMMAND] Executing: ".concat(commandName, " in Server: ").concat(serverId)); // Execute command and pass serverId

          _context.next = 27;
          return regeneratorRuntime.awrap(client.commands.get(commandName).execute(client, message, args, serverId));

        case 27:
          _context.next = 33;
          break;

        case 29:
          _context.prev = 29;
          _context.t1 = _context["catch"](23);
          console.error("[\u274C] Error executing command: ".concat(commandName), _context.t1);
          message.reply("There was an error executing that command.");

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 14], [23, 29]]);
}); // Bot Login

client.on("ready", function () {
  return console.log("[✅] Bot is online!");
});
client.loginBot(process.env.REVOLT_TOKEN)["catch"](function (err) {
  console.error("[❌] Failed to login. Check your token:", err);
});
asd;