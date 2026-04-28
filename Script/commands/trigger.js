const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "trigger",
    aliases: ["triggered", "angry"],
    version: "2.1.0",
    author: "BOTX666 🪬",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Create a triggered GIF of a user"
    },
    category: "fun",
    guide: {
      en: "{pn} [@tag | reply | empty]"
    }
  },

  onStart: async function ({ api, event, message, usersData }) {
    const { threadID, messageID, senderID, mentions, messageReply, type } = event;
    
    // সময় ও তারিখ সেটআপ (Asia/Dhaka)
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    api.setMessageReaction("💢", messageID, () => {}, true);

    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const tmpDir = path.join(__dirname, "cache");
    const pathSave = path.join(tmpDir, `trigger_${uid}_${Date.now()}.gif`);

    try {
      await fs.ensureDir(tmpDir);
      
      const avatarURL = await usersData.getAvatarUrl(uid);
      // 'discord-image-generation' ব্যবহার করে GIF তৈরি
      const img = await new DIG.Triggered().getImage(avatarURL);
      
      await fs.writeFile(pathSave, Buffer.from(img));

      api.setMessageReaction("✅", messageID, () => {}, true);

      return message.reply({
        body: `💢 𝐓𝐑𝐈𝐆𝐆𝐄𝐑𝐄𝐃 💢\n${"━".repeat(20)}${sig}`,
        attachment: fs.createReadStream(pathSave)
      }, () => {
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      });

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      return message.reply(`❌ চাঁদের পাহাড়, GIF তৈরি করতে সমস্যা হয়েছে!${sig}`);
    }
  }
};
