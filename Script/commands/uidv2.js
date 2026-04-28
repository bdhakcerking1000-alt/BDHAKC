const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "uidv2",
    aliases: ["id", "userinfo"],
    version: "36.0.0",
    author: "BOTX666 🪬",
    countDown: 2,
    role: 0,
    category: "utility",
    description: {
      en: "Generate a premium UID card with profile picture"
    },
    guide: {
      en: "{pn} | {pn} @mention | reply"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    // সময় ও তারিখ সেটআপ (Asia/Dhaka)
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    let targetID = senderID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    }

    api.setMessageReaction("🔍", messageID, () => {}, true);

    const imgPath = path.join(cacheDir, `uid_card_${targetID}_${Date.now()}.png`);

    try {
      // ইউজারের নাম সংগ্রহ
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "Facebook User";

      // প্রোফাইল পিকচার এবং কার্ড এপিআই
      const realAvatar = `https://graph.facebook.com/${targetID}/picture?width=1024&height=1024&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const t1 = encodeURIComponent(`USER: ${userName.toUpperCase()}`);
      const t2 = encodeURIComponent(`UID: ${targetID}`);
      const t3 = encodeURIComponent(`BRAND: BOTX666`);

      // Popcat API ব্যবহার করে প্রিমিয়াম কার্ড তৈরি
      const cardApi = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(realAvatar)}&text1=${t1}&text2=${t2}&text3=${t3}&avatar=${encodeURIComponent(realAvatar)}&color=FFD700`;

      const response = await axios({
        method: "GET",
        url: cardApi,
        responseType: "arraybuffer",
        timeout: 25000
      });

      await fs.writeFile(imgPath, Buffer.from(response.data));
      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: `👤 𝐔𝐒𝐄𝐑 𝐈𝐃𝐄𝐍𝐓𝐈𝐓𝐘 𝐂𝐀𝐑𝐃 👤\n━━━━━━━━━━━━━━━━━━━━\n🆔 𝐔𝐈𝐃: ${targetID}\n👤 𝐍𝐚𝐦𝐞: ${userName}${sig}`,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }, messageID);

    } catch (error) {
      console.error("UID ERROR:", error);
      api.setMessageReaction("⚠️", messageID, () => {}, true);
      return api.sendMessage(`🆔 𝐔𝐈𝐃: ${targetID}${sig}`, threadID, messageID);
    }
  }
};
