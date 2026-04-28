const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "gray",
    aliases: ["greyscale", "blackwhite"],
    version: "2.1.0",
    author: "BOTX666 🪬",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Convert profile picture to greyscale"
    },
    category: "fun",
    guide: {
      en: "{pn} [@mention বা reply]\nকিছু না দিলে আপনার নিজের প্রোফাইল পিকচার গ্রে-স্কেল হবে।"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { senderID, mentions, type, messageReply, messageID } = event;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    // ১. টার্গেট ইউজার আইডি নির্ধারণ
    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    // ২. প্রসেসিং শুরু (রিঅ্যাকশন)
    api.setMessageReaction("⏳", messageID, () => {}, true);

    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    try {
      // ৩. এপিআই কল করে গ্রে-স্কেল ইমেজ সংগ্রহ
      const res = await axios.get(`https://api.popcat.xyz/v2/greyscale?image=${encodeURIComponent(avatarURL)}`, {
        responseType: "arraybuffer"
      });

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir); // ক্যাশ ফোল্ডার না থাকলে তৈরি করবে
      const filePath = path.join(cacheDir, `gray_${uid}_${Date.now()}.png`);
      
      await fs.writeFile(filePath, Buffer.from(res.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      // ৪. ফাইনাল আউটপুট ডিজাইন
      return message.reply({
        body: `⚫ 𝐆𝐫𝐞𝐲𝐬𝐜𝐚𝐥𝐞 𝐄𝐟𝐟𝐞𝐜𝐭 𝐀𝐩𝐩𝐥𝐢𝐞𝐝! ⚫${sig}`,
        attachment: fs.createReadStream(filePath)
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ চাঁদের পাহাড়, ছবি তৈরি করতে সমস্যা হয়েছে!${sig}`);
    }
  }
};
