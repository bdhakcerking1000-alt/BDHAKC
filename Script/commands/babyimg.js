const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "babyimg",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Chander Pahar x Gemini",
  description: "নির্দিষ্ট শব্দে অটোমেটিক ছবি দিয়ে রিপ্লাই (চাঁদের পাহাড় স্পেশাল)",
  commandCategory: "Auto",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const imageTriggers = [
  {
    keywords: ["খাবো", "khuda lagse", "khabo"],
    imageUrl: "https://i.postimg.cc/x8p156pR/8c3b955e8309b478efc1073e09f72075.jpg",
    reply: "🍽️ এই নিন আপনার খাবার, শান্ত হয়ে বসুন! 😋",
    fileName: "khabo.jpg"
  },
  {
    keywords: ["ঘুমাবো", "ghumu", "sleep", "gumabo"],
    imageUrl: "https://i.postimg.cc/Vs26JVMf/e052f3e1f21ab2d1c07312c720eda6ae.jpg",
    reply: "🌙 রাত অনেক হয়েছে, চাঁদের পাহাড়ে গিয়ে ঘুমিয়ে পড়ুন! 😴",
    fileName: "gumkorefela.jpg"
  },
  {
    keywords: ["কিরে", "kire", "oy"],
    imageUrl: "https://i.imgur.com/kEfzo4h.jpeg", // আপনার দেওয়া ব্যানার ইমেজ
    reply: "চিনতে পারছেন? আমি চাঁদের পাহাড়ের পাহারাদার! 🏔️⚔️",
    fileName: "oy.jpg"
  },
  {
    keywords: ["ভালোবাসি", "i love you", "valobashi"],
    imageUrl: "https://i.postimg.cc/qMwr5nh6/IMG-6381.jpg",
    reply: "চাঁদের পাহাড়ের অ্যাডমিন শুনলে কিন্তু খবর আছে! 🎀🧃",
    fileName: "maria.jpg"
  },
  {
    keywords: ["ম্যাজিক দেখাও", "magic", "modu"],
    imageUrl: "https://i.imgur.com/qyewZ9R.jpeg",
    reply: "🪄 চাঁদের পাহাড়ের স্পেশাল ম্যাজিক দেখুন!",
    fileName: "magic.jpg"
  },
  {
    keywords: ["মারামারি", "fight", "maramari"],
    imageUrl: "https://i.postimg.cc/j5N1pWc7/81e81232266d1c0220e6f4cbf7214bea.jpg",
    reply: "এই গ্রুপে শান্তিতে থাকুন, মারামারি করবেন না! 🛑",
    fileName: "fight.jpg"
  }
];

module.exports.handleEvent = async function({ api, event }) {
  const msg = event.body?.toLowerCase();
  if (!msg) return;

  for (const trigger of imageTriggers) {
    if (trigger.keywords.some(k => msg.includes(k))) {
      const filePath = path.join(__dirname, "cache", trigger.fileName);
      
      // cache ফোল্ডার না থাকলে তৈরি করা
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
          fs.mkdirSync(path.join(__dirname, "cache"));
      }

      try {
        const res = await axios.get(trigger.imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

        api.sendMessage({
          body: trigger.reply,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, event.messageID);
        
      } catch (err) {
        console.log(`❌ Failed to send image for ${trigger.keywords[0]}:`, err.message);
      }
      return;
    }
  }
};

module.exports.run = () => {};
