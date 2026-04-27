const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hitler",
    aliases: ["হিটলার"],
    version: "2.0.0",
    author: "Belal YT",
    countDown: 10,
    role: 0,
    shortDescription: {
      bn: "কাউকে হিটলার বানিয়ে মজার ছবি তৈরি করুন",
      en: "Create a funny Hitler image of someone"
    },
    category: "fun",
    guide: {
      bn: '{pn} @mention/reply: কাউকে হিটলার বানাতে ট্যাগ করুন',
      en: '{pn} @mention/reply: Tag/Reply to make someone Hitler'
    }
  },

  onStart: async function ({ api, event, args, message, Users }) {
    const { threadID, messageID, mentions, messageReply } = event;
    const sig = "\n┈───╼ ┄┉❈✡️ Chander Pahar ✿⃝🪬 ╾───┈";
    const startTime = Date.now();

    // ১. অথর চেক (সিকিউরিটি)
    if (this.config.author !== "Belal YT") {
      return api.sendMessage("⚠️ [ SECURITY ALERT ]\nAuthor name change detected! Please reset to 'Belal YT'.", threadID, messageID);
    }

    // ২. টার্গেট আইডি সংগ্রহ
    let id;
    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0] && !isNaN(args[0])) {
      id = args[0];
    }

    if (!id) return message.reply("× বেবি, কাউকে মেনশন দাও, রিপ্লাই করো অথবা UID দাও! 🎖");

    // ৩. ক্যাশ ডিরেক্টরি চেক
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
    const filePath = path.join(cacheDir, `hitler_${id}_${Date.now()}.png`);

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      const name = await Users.getNameUser(id);
      
      // ৪. এপিআই কল (Canvas/Dig API)
      const url = `https://api.popcat.xyz/ad?image=https://graph.facebook.com/${id}/picture?height=512&width=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      // দ্রষ্টব্য: পপক্যাট বা ক্যানভাস এপিআই ব্যবহার করা হয়েছে যা বেশি স্টেবল।

      const response = await axios.get(`https://tanjiro-api.onrender.com/hitler?url=https://graph.facebook.com/${id}/picture?width=512&height=512`, { responseType: "arraybuffer" });
      
      fs.writeFileSync(filePath, Buffer.from(response.data));

      const latency = Date.now() - startTime;
      api.setMessageReaction("🎖", messageID, () => {}, true);

      // ৫. ফাইনাল আউটপুট
      const finalBody = `╭━━━━━━━⊱ 💠 ⊰━━━━━━━╮\n   🎖 𝗛𝗜𝗧𝗟𝗘𝗥 𝗘𝗗𝗜𝗧 𝗗𝗢𝗡𝗘 🎖\n╰━━━━━━━⊱ 💠 ⊰━━━━━━━╯\n\n` +
        `🐸 এই নাও তোমার হিটলার ছবি বেবি!\n` +
        `👤 𝗧𝗮𝗿𝗴𝗲𝘁 : ${name}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱  : ${latency}ms\n` +
        `🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀 : Processed 🟢\n` +
        `🏔️ 𝗕𝗿𝗮𝗻𝗱  : চাঁদের পাহাড়\n` +
        `👑 𝗔𝗱𝗺𝗶𝗻  : BELAL YT${sig}`;

      return message.reply({
        body: finalBody,
        attachment: fs.createReadStream(filePath)
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return message.reply("× দুঃখিত বেবি, ইমেজ জেনারেট করতে সমস্যা হয়েছে! পরে ট্রাই করো।");
    }
  }
};
