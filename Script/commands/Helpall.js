const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
 name: "help all",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐒𝐀𝐇𝐔",
 description: "Displays all available commands in one page",
 commandCategory: "system",
 usages: "[No args]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;

 const allCommands = [];

 for (let [name] of commands) {
 if (name && name.trim() !== "") {
 allCommands.push(name.trim());
 }
 }

 allCommands.sort();

 const finalText = `╔═══❖ 🌟 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌟 ❖═══╗
${allCommands.map(cmd => `║ ➔ ${cmd}`).join("\n")}
╠═════🔰 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🔰═════╣
║ 🤖 𝐁𝐨𝐭: 𒀱⃝⃞⃟✡️🅱🅴🅻🅰🅻 🅱🅾🆃❤⃝⃞⃟𒀱ꪳ
║ 👑 𝐎𝐰𝐧𝐞𝐫:┄┉❈✡️⋆⃝ চাঁদেড়~পাহাড়✿⃝🪬❈┉┄
║ 📦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.length} 
╚═══════════════════════╝`;

 
 const backgrounds = [
 "https://i.imgur.com/CY5sgsk.jpeg",
 "https://i.imgur.com/mkYGNNk.jpeg",
 "https://i.imgur.com/gF5wIwg.jpeg",
 "https://i.imgur.com/UAmIDz2.jpeg",
 "https://i.imgur.com/6b6DGcW.jpeg",
 "https://i.imgur.com/FQQq8WH.jpeg",
 "https://i.imgur.com/uEPmaG5.jpeg"
 ];
 const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
 const imgPath = __dirname + "/cache/helpallbg.jpg";

 const callback = () =>
 api.sendMessage({ body: finalText, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

 request(encodeURI(selectedBg))
 .pipe(fs.createWriteStream(imgPath))
 .on("close", () => callback());
};
