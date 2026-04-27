const QRCode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "qrgen",
    aliases: ["qrcode", "qr"],
    version: "2.1.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 5,
    role: 0,
    shortDescription: { en: "টেক্সট বা লিঙ্ক থেকে QR কোড তৈরি করুন" },
    category: "utility",
    guide: { en: "{pn} [text or link]" }
  },

  onStart: async function({ api, message, args, event }) {
    const { threadID, messageID } = event;
    const startTime = Date.now();
    const data = args.join(" ").trim();
    
    // আপনার ইউনিক সিগনেচার
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    if (!data) {
      return message.reply("⚠️ বেলাল ভাই, QR কোড বানানোর জন্য কোনো লিঙ্ক বা টেক্সট দিন।\nউদাহরণ: {pn} https://facebook.com");
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
    const tempFilePath = path.join(cacheDir, `qr_${Date.now()}.png`);

    try {
      // ফিউচারিস্টিক ব্ল্যাক এন্ড হোয়াইট QR জেনারেশন
      await QRCode.toFile(tempFilePath, data, {
        color: {
          dark: '#000000', 
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H', // হাই কোয়ালিটি স্ক্যানিং
        margin: 2,
        scale: 10
      });

      const latency = Date.now() - startTime;
      api.setMessageReaction("✅", messageID, () => {}, true);

      // নতুন ডিজিটাল ইন্টারফেস ডিজাইন
      const qrBody = `╭━━━❖✦🪬✦❖━━━╮\n  ✡️  চাঁদের 𖤍 পাহাড়  🪬\n╰━━━❖✦🪬✦❖━━━╯\n\n` +
        `💠 𝗤𝗥 𝗖𝗢𝗗𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 𝗗𝗮𝘁𝗮   : ${data.length > 30 ? data.substring(0, 30) + "..." : data}\n` +
        `📡 𝗦𝘁𝗮𝘁𝘂𝘀 : Encrypted 🔒\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱  : ${latency}ms\n\n` +
        `𖤍 𝗔ד𝗺𝗶𝗻  : BELAL ⊶ BOTX666 🪬${sig}`;

      await message.reply({
        body: qrBody,
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply("❌ দুঃখিত বেলাল ভাই, QR কোড তৈরি করতে সমস্যা হয়েছে!");
    } finally {
      if (fs.existsSync(tempFilePath)) {
        setTimeout(() => fs.unlinkSync(tempFilePath), 2000);
      }
    }
  }
};
