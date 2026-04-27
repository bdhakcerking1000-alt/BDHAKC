const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "Belal",
    version: "3.8.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 5,
    role: 0,
    shortDescription: "Show owner info with Random Images",
    category: "info"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const msg = event.body ? event.body.toLowerCase() : "";
    if (msg !== "admin" && msg !== "owner") return;

    const time = new Date().toLocaleTimeString("en-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const info = `
╭━━━〔《𓆩 𝐀𝐃𝐌𝐈𝐍 𝐈𝐍𝐅𝐎 𓆪》〕━━━╮
┃ 🏷️ 𝐆𝐑𝐎𝐔𝐏: 𝐁𝐎𝐓𝐗𝟔𝟔 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘
┃ 🔰 𝐒𝐘𝐒𝐓𝐄𝐌: 𝖦𝗈𝖺𝗍𝖡𝗈𝗍 𝖵𝟤
┃ ⏰ 𝐓𝐈𝐌𝐄: ${time}
┃ 📅 𝐃𝐀𝐓𝐄: ${date}
┃ 👑 𝐎𝐖𝐍𝐄𝐑: 𝐌𝐃 𝐁𝐄𝐋𝐀𝐋 
┃ ⚡ 𝐒𝐓𝐀𝐓𝐔𝐒: 𝐎𝐍𝐋𝐈𝐍𝐄 🪬
╰━━━〔《𓆩 𝐁𝐎𝐓𝐗𝟔𝟔 𓆪》〕━━━╯

╭━━━〔《𓆩 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𓆪》〕━━━╮
┃ 👤 𝐍𝐀𝐌𝐄: 𝐌𝐃 𝐁𝐄𝐋𝐀𝐋 (𝐂𝐡𝐚𝐧𝐝𝐞𝐫 𝐏𝐚𝐡𝐚𝐫)
┃ 🏠 𝐀𝐃𝐃𝐑𝐄𝐒𝐒: 𝐊𝐔𝐑𝐈𝐆𝐑𝐀𝐌, 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇
┃ 📞 𝐏𝐇𝐎𝐍𝐄: 𝟎𝟏𝟗𝟏𝟑𝟐𝟒𝟔𝟓𝟓𝟒
┃ 🎂 𝐀𝐆𝐄: 𝟐𝟎+
┃ 💔 𝐒𝐓𝐀𝐓𝐔𝐒: 𝐒𝐈𝐍𝐆𝐋𝐄 (𝐎𝐧 𝐒𝐞𝐚𝐫𝐜𝐡)
┃ 💼 𝐉𝐎𝐁: 𝐁𝐒 𝐃𝐄𝐀𝐋𝐄𝐑
╰━━━〔《𓆩 𝐈𝐍𝐅𝐎 𓆪》〕━━━╯

╭━━━〔《𓆩 𝐋𝐈𝐅𝐄𝐒𝐓𝐘𝐋𝐄 𓆪》〕━━━╮
┃ 💋 𝐇𝐎𝐁𝐁𝐘: 𝐂𝐎𝐃𝐈𝐍𝐆 & 𝐄𝐃𝐈𝐓𝐈𝐍𝐆
┃ 🎵 𝐋𝐈𝐊𝐄: 𝐒𝐎𝐅𝐓 𝐌𝐔𝐒𝐈𝐂 & 𝐓𝐑𝐀𝐕𝐄𝐋𝐋𝐈𝐍𝐆
┃ 🎮 𝐆𝐀𝐌𝐄: 𝐏𝐔𝐁𝐆 & 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄
╰━━━〔《𓆩 𝐇𝐎𝐁𝐁𝐘 𓆪》〕━━━╯

╭━━━〔《𓆩 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 𓆪》〕━━━╮
┃ 😎 𝖨 𝖣𝖮𝖭'𝖳 𝖥𝖮𝖫𝖫𝖮𝖶 𝖮𝖳𝖧𝖤𝖱𝖲
┃ 🔥 𝖨 𝖠𝖬 𝖬𝖸 𝖮𝖶𝖭 𝖫𝖤𝖦𝖤𝖭𝖣
┃ 💔 𝖱𝖤𝖲𝖯𝖤𝖢𝖳 𝖨𝖲 𝖤𝖠𝖱𝖭𝖤𝖣, 𝖭𝖮𝖳 𝖦𝖨𝖵𝖤𝖭
┃ ⚡ 𝐁𝐄𝐋𝐀𝐋 𝐈𝐒 𝐀 𝐁𝐑𝐀𝐍𝐃
╰━━━〔《𓆩 𝐊𝐈𝐍𝐆 𓆪》〕━━━╯
┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄`;

    // 🖼️ আপনার দেওয়া ৫টি Imgur লিঙ্ক (Randomized)
    const imgUrls = [
      "https://i.imgur.com/i30s2xf.jpeg",
      "https://i.imgur.com/kEfzo4h.jpeg",
      "https://i.imgur.com/BHUZIKN.jpeg",
      "https://i.imgur.com/Zbid9rU.jpeg",
      "https://i.imgur.com/VGdyICK.jpeg"
    ];
    
    const randomImg = imgUrls[Math.floor(Math.random() * imgUrls.length)];
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "Belal_Admin.jpg");

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const response = await axios({
        url: randomImg,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: info,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          },
          event.messageID
        );
      });

    } catch (e) {
      console.error(e);
      api.sendMessage(info, event.threadID, event.messageID);
    }
  }
};
