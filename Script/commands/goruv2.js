const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "goruv2",
    aliases: ["goru2", "cow2"],
    version: "2.0.0",
    author: "Belal YT",
    countDown: 8,
    role: 0,
    category: "fun",
    shortDescription: { en: "Advanced Cow edit with Chander Pahar UI" },
    guide: { en: "{pn} @mention or reply" }
  },

  onStart: async function ({ api, event, message, Users }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const sig = "\n┈───╼ ┄┉❈✡️ 𝗖𝗵𝗮𝗻𝗱𝗲𝗿 𝗣𝗮𝗵𝗮𝗿 ✿⃝🪬 ╾───┈";
    const startTime = Date.now();

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    // ১. টার্গেট সিলেকশন
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      return message.reply("⚠️ আরে বলদ, কারে গরু বানাবি তারে তো মেনশন দিলি না! 🐄");
    }

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      
      const targetName = await Users.getNameUser(targetID);
      const filePath = path.join(cacheDir, `goruv2_${Date.now()}.png`);

      const processingMsg = await message.reply("🔄 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗜𝗡𝗚: চাঁদের পাহাড় থেকে একটি তাজা গরু আনা হচ্ছে আপনার জন্য... 🐄💨");

      // ২. রিসোর্স লোডিং (৫১২px হাই রেজোলিউশন)
      const baseImgLink = "https://i.imgur.com/pkoB67f.jpeg";
      const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      
      const userPfpUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${token}`;
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${token}`;

      const [baseImage, userPfp, targetPfp] = await Promise.all([
        loadImage(baseImgLink),
        loadImage(userPfpUrl).catch(() => loadImage("https://i.imgur.com/6veZ79p.png")),
        loadImage(targetPfpUrl).catch(() => loadImage("https://i.imgur.com/6veZ79p.png"))
      ]);

      // ৩. ক্যানভাস ম্যাজিক
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // --- Sender (বসের ছবি) ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(220, 205, 52, 0, Math.PI * 2, true); 
      ctx.clip();
      ctx.drawImage(userPfp, 168, 153, 104, 104); 
      ctx.restore();

      // --- Target (গরুর ছবি) ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(110, 340, 52, 0, Math.PI * 2, true); 
      ctx.clip();
      ctx.drawImage(targetPfp, 58, 288, 104, 104); 
      ctx.restore();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const latency = Date.now() - startTime;
      api.setMessageReaction("✅", messageID, () => {}, true);

      // ৪. লাক্সারি ক্যাপশন ও ব্র্যান্ডিং
      const finalMsg = `╭━━━━━━━⊱ 💠 ⊰━━━━━━━╮\n   ✨ 𝗚𝗢𝗥𝗨 𝗩𝟮 𝗘𝗗𝗜𝗧𝗘𝗗 ✨\n╰━━━━━━━⊱ 💠 ⊰━━━━━━━╯\n\n` +
        `🐄 এই নে তোর পারফেক্ট লুক!\n` +
        `👤 𝗧𝗮𝗿𝗴𝗲𝘁 : ${targetName}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🌐 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱  : ${latency}ms\n` +
        `🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀 : High Quality 🟢\n` +
        `🏔️ 𝗕𝗿𝗮𝗻𝗱  : চাঁদের পাহাড়\n` +
        `👑 𝗔𝗱𝗺𝗶𝗻  : BELAL YT${sig}`;

      await api.unsendMessage(processingMsg.messageID);
      
      return api.sendMessage({
        body: finalMsg,
        mentions: [{ tag: targetName, id: targetID }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ সার্ভার থেকে গরু লোড করতে সমস্যা হয়েছে! পরে ট্রাই করুন।");
    }
  }
};
