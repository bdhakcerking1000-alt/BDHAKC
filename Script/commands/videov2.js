const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "videov2",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "ইউটিউব থেকে ভিডিও ডাউনলোড করার আধুনিক সিস্টেম",
  commandCategory: "Media",
  usages: "[ভিডিওর নাম বা লিঙ্ক]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "yt-search": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  if (!args[0]) return api.sendMessage("❌ বেলাল ভাই, কোন ভিডিওটি দেখতে চান? নাম বা লিঙ্ক দিন।", threadID, messageID);

  const input = args.join(" ");
  api.setMessageReaction("⏳", messageID, () => {}, true);
  let waitMsg = await api.sendMessage(`🎬 ভিডিওটি খোঁজা হচ্ছে, দয়া করে অপেক্ষা করুন...`, threadID);

  try {
    let videoUrl;
    let title;

    // ১. ইউআরএল নাকি নাম তা চেক করা
    if (input.includes("youtube.com") || input.includes("youtu.be")) {
      videoUrl = input;
    } else {
      const search = await yts(input);
      const video = search.videos[0];
      if (!video) return api.sendMessage("❌ কোনো ভিডিও পাওয়া যায়নি!", threadID, messageID);
      videoUrl = video.url;
      title = video.title;
    }

    // ২. মাল্টি-এপিআই সোর্স (High Speed)
    const apiList = [
      `https://api.vkrnoob.xyz/api/yt/play?url=${encodeURIComponent(videoUrl)}`,
      `https://shiron-search-api.onrender.com/api/yt/play?url=${encodeURIComponent(videoUrl)}`
    ];

    let downloadUrl = "";
    let videoTitle = title || "video";

    for (const apiUrl of apiList) {
      try {
        const res = await axios.get(apiUrl);
        downloadUrl = res.data.downloadUrl || res.data.url || res.data.link;
        videoTitle = res.data.title || videoTitle;
        if (downloadUrl) break;
      } catch (e) { continue; }
    }

    if (!downloadUrl) throw new Error("API failed");

    // ৩. ভিডিও ফাইল ডাউনলোড এবং সাইজ চেক
    const filePath = path.join(cacheDir, `${Date.now()}.mp4`);
    const videoStream = await axios.get(downloadUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(videoStream.data));

    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    api.unsendMessage(waitMsg.messageID);

    // ৪. মেসেঞ্জারের ২৫ এমবি লিমিট হ্যান্ডলিং
    if (fileSizeMB > 25) {
      fs.unlinkSync(filePath);
      api.setMessageReaction("⚠️", messageID, () => {}, true);
      return api.sendMessage(`⚠️ বেলাল ভাই, ভিডিওটির সাইজ ${fileSizeMB.toFixed(2)}MB, যা মেসেঞ্জারের লিমিট (25MB) এর চেয়ে বেশি।\n\n📥 এখান থেকে ডাউনলোড করুন:\n${downloadUrl}`, threadID, messageID);
    }

    // ৫. ভিডিও সেন্ড করা
    api.setMessageReaction("✅", messageID, () => {}, true);
    return api.sendMessage({
      body: `🎥 ভিডিও: ${videoTitle}\n⚖️ সাইজ: ${fileSizeMB.toFixed(2)} MB`,
      attachment: fs.createReadStream(filePath)
    }, threadID, () => fs.unlinkSync(filePath), messageID);

  } catch (err) {
    console.error(err);
    api.unsendMessage(waitMsg.messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
    return api.sendMessage("🚨 ভিডিওটি ডাউনলোড করতে সমস্যা হয়েছে! পরে চেষ্টা করুন।", threadID, messageID);
  }
};
