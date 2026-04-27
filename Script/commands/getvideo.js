const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiKey = "11379c5d-5de2-42b5-b1e2-8a378e3c2812";
const dataFile = path.join(__dirname, "cache", "sentVideo.json");

// ডাটা লোড ও সেভ করার উন্নত ফাংশন
function loadSentList() {
  if (!fs.existsSync(dataFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (e) { return []; }
}

function saveSentList(data) {
  if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "getvideo",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "rX Abdullah x Gemini",
  description: "পিক্সেলড্রেইন অ্যাকাউন্ট থেকে র‍্যান্ডম ভিডিও পাঠানো",
  commandCategory: "media",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // ১. পিক্সেলড্রেইন থেকে ফাইল লিস্ট আনা
    const res = await axios.get(`https://pixeldrain.com/api/user/files`, {
      headers: { "Authorization": `Basic ${Buffer.from(":" + apiKey).toString("base64")}` }
    });

    // ২. শুধুমাত্র ভিডিও ফিল্টার করা
    const allVideos = res.data.files.filter(file => file.mime_type && file.mime_type.includes("video"));
    
    if (allVideos.length === 0) return api.sendMessage("❌ আপনার পিক্সেলড্রেইন অ্যাকাউন্টে কোনো ভিডিও পাওয়া যায়নি।", threadID, messageID);

    let sentList = loadSentList();
    let unsentVideos = allVideos.filter(file => !sentList.includes(file.id));

    // সব ভিডিও পাঠানো হয়ে গেলে লিস্ট রিসেট করা
    if (unsentVideos.length === 0) {
      sentList = [];
      unsentVideos = allVideos;
      api.sendMessage("♻️ সব ভিডিও একবার করে পাঠানো শেষ। আবার শুরু থেকে পাঠানো হচ্ছে...", threadID);
    }

    // ৩. র‍্যান্ডম ভিডিও নির্বাচন
    const randomVideo = unsentVideos[Math.floor(Math.random() * unsentVideos.length)];
    const videoUrl = `https://pixeldrain.com/api/file/${randomVideo.id}`;
    
    // ৪. ফাইল সাইজ চেক (মেসেঞ্জারে ২৫ এমবির বেশি পাঠানো যায় না)
    if (randomVideo.size > 26214400) { // 25MB
       return api.sendMessage("⚠️ ভিডিওর সাইজ ২৫ এমবির বেশি হওয়ায় পাঠানো সম্ভব হচ্ছে না। অন্য একটি চেষ্টা করছি...", threadID, () => {
         sentList.push(randomVideo.id);
         saveSentList(sentList);
         return this.run({ api, event }); // বড় ফাইল হলে স্কিপ করে পরেরটা নিবে
       });
    }

    api.sendMessage("⏳ ভিডিওটি প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", threadID, async (err, info) => {
      try {
        const stream = await global.utils.getStreamFromURL(videoUrl);
        
        return api.sendMessage({
          body: `🎬 আপনার ভিডিও প্রস্তুত!\n📝 নাম: ${randomVideo.name || "Unknown"}\n📊 সাইজ: ${(randomVideo.size / (1024 * 1024)).toFixed(2)} MB`,
          attachment: stream
        }, threadID, () => {
          sentList.push(randomVideo.id);
          saveSentList(sentList);
          api.unsendMessage(info.messageID);
        }, messageID);
      } catch (e) {
        api.sendMessage("❌ ভিডিওটি পাঠাতে সমস্যা হয়েছে।", threadID, messageID);
      }
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ পিক্সেলড্রেইন সার্ভারে সমস্যা হয়েছে। এপিআই কী চেক করুন।", threadID, messageID);
  }
};
