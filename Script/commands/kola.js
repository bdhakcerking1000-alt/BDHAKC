const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔐 AUTHOR LOCK SYSTEM (BELAL YT PROTECT)
const AUTHOR_NAME = "Belal YT";

module.exports = {
  config: {
    name: "kola",
    version: "3.0.0",
    author: "Belal YT",
    countDown: 8,
    role: 0,
    category: "fun",
    usePrefix: true,
    shortDescription: { en: "কাউকে কলা এডিট করে মজার ছবি তৈরি করুন।" },
    guide: { en: "{pn} @mention or reply" }
  },

  onStart: async function ({ api, event, message, Users }) {
    const { threadID, messageID, mentions, messageReply, senderID } = event;
    const sig = "\n┈───╼ ┄┉❈✡️ Chander Pahar ✿⃝🪬 ╾───┈";
    const startTime = Date.now();

    // ১. সিকিউরিটি চেক (আপনার নিজস্ব অথর নাম যাচাই)
    if (this.config.author !== AUTHOR_NAME) {
      return api.sendMessage("⚠️ [ SECURITY ALERT ]\nAuthor name change detected! Please reset to 'Belal YT'.", threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    // ২. টার্গেট আইডি ডিটেকশন
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      targetID = senderID;
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const userName = await Users.getNameUser(targetID);
      const filePath = path.join(cacheDir, `kola_milon_${Date.now()}.png`);

      // ৩. রিসোর্স লোডিং
      const imgLink = "https://i.imgur.com/iNV52mX.jpeg"; 
      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(targetPfpUrl).catch(() => loadImage("https://i.imgur.com/6veZ79p.png"))
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // ৪. ক্যানভাস পজিশনিং (LOCKED POSITIONS)
      const pfpWidth = 130;
      const pfpHeight = 170;
      const x = (canvas.width / 2) - (pfpWidth / 2) + 25;
      const y = (canvas.height / 2) - (pfpHeight / 2) - 110;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x + pfpWidth / 2, y + pfpHeight / 2, pfpWidth / 2, pfpHeight / 2, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(targetPfp, x, y, pfpWidth, pfpHeight);
      ctx.restore();

      // ৫. বর্ডার ডিজাইন
      ctx.beginPath();
      ctx.ellipse(x + pfpWidth / 2, y + pfpHeight / 2, pfpWidth / 2, pfpHeight / 2, 0, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const latency = Date.now() - startTime;
      api.setMessageReaction("✅", messageID, () => {}, true);

      // ৬. প্রিমিয়াম আউটপুট ডেলিভারি
      const finalCaption = `╭━━━━━━━⊱ 💠 ⊰━━━━━━━╮\n   ✨ 𝗞𝗢𝗟𝗔 𝗘𝗗𝗜𝗧 𝗗𝗢𝗡𝗘 ✨\n╰━━━━━━━⊱ 💠 ⊰━━━━━━━╯\n\n` +
        `ঐ দেখ মামা, এরে চিনতে পারস কি না! 😂\n\n` +
        `🥰 𝗡𝗮𝗺𝗲: ${userName}\n` +
        `🎭 মামা, ইজ্জত যা ছিল সব তো শেষ! 👏💃\n\n` +
        `📊 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱  : ${latency}ms\n` +
        `🏔️ 𝗕𝗿𝗮𝗻𝗱  : চাঁদের পাহাড়\n` +
        `👑 𝗔𝗱𝗺𝗶𝗻  : BELAL YT${sig}`;

      return api.sendMessage({
        body: finalCaption,
        mentions: [{ tag: userName, id: targetID }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("মামা ঝামেলা হইছে, ওরে কলা খাওয়ানো গেল না! ❌");
    }
  }
};
