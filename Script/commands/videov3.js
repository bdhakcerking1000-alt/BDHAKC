const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "videov3",
    version: "2.3.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 10,
    role: 0,
    shortDescription: "YouTube ভিডিও ডাউনলোড করুন",
    longDescription: "ইউটিউব থেকে ভিডিও সার্চ করে সরাসরি বটের মাধ্যমে ডাউনলোড করুন।",
    category: "media",
    guide: {
      en: "video <song name>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, body } = event;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    let query = args.join(" ");
    if (!query && body) {
      query = body.replace(/^video\s+/i, "").trim();
    }

    if (!query || query.toLowerCase() === "video") {
      return api.sendMessage(
        `❌ চাঁদের পাহাড়, ভিডিওর নাম দিন।\n📌 উদাহরণ: video ওরে নীল দরিয়া${sig}`,
        threadID,
        messageID
      );
    }

    let tempMsgID = null;

    try {
      const searching = await api.sendMessage(
        `╭━━━━━━⊱🔎⊰━━━━━━╮\n   𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆 𝐘𝐎𝐔𝐓𝐔𝐁𝐄\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n📌 𝐐𝐮𝐞𝐫𝐲: ${query}\n🪬 চাঁদের পাহাড়, একটু অপেক্ষা করুন...`,
        threadID
      );
      tempMsgID = searching.messageID;

      // ভিডিও সার্চ
      const searchRes = await axios.get(
        `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`
      );

      const video = searchRes.data?.[0];
      if (!video || !video.url) throw new Error("কোনো ফলাফল পাওয়া যায়নি!");

      await api.unsendMessage(tempMsgID).catch(() => {});

      const downloading = await api.sendMessage(
        `🎬 𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐔𝐍𝐃\n━━━━━━━━━━━━━━━\n📖 𝐓𝐢𝐭𝐥𝐞: ${video.title}\n⬇️ ভিডিওটি লোড হচ্ছে...`,
        threadID
      );
      tempMsgID = downloading.messageID;

      // ডাউনলোড লিঙ্ক সংগ্রহ
      const dlRes = await axios.get(
        `https://yt-api-imran.vercel.app/api?url=${video.url}`
      );

      const downloadUrl = dlRes.data?.downloadUrl;
      if (!downloadUrl) throw new Error("ডাউনলোড লিঙ্ক পাওয়া যায়নি!");

      // ফাইল সেভ করার পাথ
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);

      // সরাসরি স্ট্রিম করে ডাউনলোড (বড় ফাইলের জন্য নিরাপদ)
      const res = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const finalMessage = {
        body:
          `╭━━━━━━⊱✅⊰━━━━━━╮\n   𝐕𝐈𝐃𝐄𝐎 𝐈𝐒 𝐑𝐄𝐀𝐃𝐘\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n📖 𝐓𝐢𝐭𝐥𝐞: ${video.title}\n⏱ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${video.time}\n\n𖤍 𝐀𝐝𝐦𝐢𝐧: MD BELAL (BS Dealer)\n🏠 𝐇𝐨𝐦𝐞: KURIGRAM, BD${sig}`,
        attachment: fs.createReadStream(filePath)
      };

      await api.sendMessage(finalMessage, threadID, async () => {
        if (fs.existsSync(filePath)) await fs.unlink(filePath);
      }, messageID);

      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});

    } catch (err) {
      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});
      api.sendMessage(
        `❌ এরর: ${err.message || "সমস্যা হয়েছে, পরে চেষ্টা করুন।"}${sig}`,
        threadID,
        messageID
      );
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
