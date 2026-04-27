const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports.config = {
  name: "sing",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "ইউটিউব থেকে গান ডাউনলোড করার সেরা সিস্টেম",
  commandCategory: "Music",
  usages: "[গানের নাম]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "yt-search": ""
  }
};

// ১. মাল্টি-এপিআই সোর্স (যাতে একটি ডাউন থাকলেও অন্যটি কাজ করে)
const apiSources = [
  "https://api.popcat.xyz/play?url=",
  "https://api.vkrnoob.xyz/api/yt/play?url=",
  "https://shiron-search-api.onrender.com/api/yt/play?url="
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const query = args.join(" ");
  if (!query) return api.sendMessage("❌ বেলাল ভাই, কোন গানটা শুনবেন? নাম তো লিখলেন না!", threadID, messageID);

  try {
    api.setMessageReaction("🔍", messageID, () => {}, true);
    const search = await yts(query);
    const videos = search.videos.slice(0, 6);

    if (videos.length === 0) return api.sendMessage("❌ দুঃখিত, কোনো গান খুঁজে পাওয়া যায়নি।", threadID, messageID);

    let msg = "🎶 𝐁𝐄𝐋𝐀𝐋 𝐌𝐔𝐒𝐈𝐂 𝐏𝐋𝐀𝐘𝐄𝐑 🎶\n━━━━━━━━━━━━━━━━━━\n";
    let attachments = [];

    for (let i = 0; i < videos.length; i++) {
      msg += `${i + 1}. ${videos[i].title}\n⏱ সময়: ${videos[i].timestamp}\n👀 ভিউ: ${videos[i].views.toLocaleString()}\n\n`;
    }
    msg += "👉 যে গানটি শুনতে চান তার নম্বর দিয়ে রিপ্লাই করুন (১-৬)";

    // থাম্বনেইল হিসেবে প্রথম ভিডিওর ছবি পাঠানো (মেমোরি সেভ করার জন্য)
    const thumbPath = path.join(cacheDir, `thumb_${senderID}.jpg`);
    const thumbRes = await axios.get(videos[0].thumbnail, { responseType: "arraybuffer" });
    fs.writeFileSync(thumbPath, Buffer.from(thumbRes.data));

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(thumbPath)
    }, threadID, (err, info) => {
      fs.unlinkSync(thumbPath);
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        videos: videos
      });
    }, messageID);

  } catch (error) {
    console.log(error);
    return api.sendMessage("🚨 সার্চ করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;
  if (senderID != handleReply.author) return;

  const index = parseInt(body) - 1;
  if (isNaN(body) || index < 0 || index >= handleReply.videos.length) {
    return api.sendMessage("❌ সঠিক নম্বর দিয়ে রিপ্লাই করুন (১-৬)।", threadID, messageID);
  }

  const video = handleReply.videos[index];
  api.unsendMessage(handleReply.messageID);
  api.sendMessage(`📥 '${video.title}' গানটি প্রসেস করা হচ্ছে...`, threadID, messageID);
  api.setMessageReaction("⏳", messageID, () => {}, true);

  const filePath = path.join(__dirname, "cache", `${Date.now()}.mp3`);

  // ডাউনলোড লজিক উইথ ফেলওভার
  let success = false;
  for (let source of apiSources) {
    if (success) break;
    try {
      const res = await axios.get(`${source}${encodeURIComponent(video.url)}`);
      const downloadUrl = res.data.downloadUrl || res.data.url || res.data.link;

      if (downloadUrl) {
        const audioRes = await axios.get(downloadUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(audioRes.data));
        
        // ফাইল সাইজ চেক (২৫ এমবির বেশি হলে মেসেঞ্জারে যাবে না)
        const stats = fs.statSync(filePath);
        if (stats.size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage("❌ গানের ফাইলটি অনেক বড় (25MB+), তাই পাঠানো সম্ভব হলো না।", threadID, messageID);
        }

        success = true;
        api.setMessageReaction("✅", messageID, () => {}, true);
        await api.sendMessage({
          body: `🎵 গান: ${video.title}\n👤 আর্টিস্ট: ${video.author.name}\n🔗 লিঙ্ক: ${video.url}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, () => fs.unlinkSync(filePath), messageID);
      }
    } catch (e) {
      console.log(`API Error from ${source}:`, e.message);
      continue; // পরের এপিআই ট্রাই করবে
    }
  }

  if (!success) {
    return api.sendMessage("🚨 দুঃখিত বেলাল ভাই, সবকটি সার্ভার এখন বিজি। পরে চেষ্টা করুন।", threadID, messageID);
  }
};
  
