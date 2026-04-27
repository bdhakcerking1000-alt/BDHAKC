const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uff",
    aliases: ["onlytik", "hot"],
    author: "BELAL ⊶ BOTX666 🪬", 
    version: "2.0",
    countDown: 10,
    role: 0, // সবার জন্য উন্মুক্ত রাখতে ০, অ্যাডমিনের জন্য হলে ২ দিন
    shortDescription: "18+ tiktok video",
    longDescription: "সরাসরি ১৮+ টিকটক ভিডিও ডাউনলোড করে পাঠাবে।",
    category: "18+",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    // ১. প্রসেসিং মেসেজ
    api.sendMessage(`╭━━━━━━⊱🔞⊰━━━━━━╮\n   𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆 𝐕𝐈𝐃𝐄𝐎\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n🪬 চাঁদের পাহাড়, ভিডিওটি লোড হচ্ছে...\nদয়া করে কিছুক্ষণ অপেক্ষা করুন।${sig}`, threadID, messageID);

    const apiUrl = "https://only-tik.vercel.app/kshitiz";

    try {
      // ২. এপিআই থেকে ডেটা সংগ্রহ
      const response = await axios.get(apiUrl);
      const { videoUrl } = response.data;

      if (!videoUrl) {
        return api.sendMessage("❌ দুঃখিত চাঁদের পাহাড়, বর্তমানে কোনো ভিডিও পাওয়া যায়নি!", threadID, messageID);
      }

      // ৩. ক্যাশ ফোল্ডার নিশ্চিত করা
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const tempVideoPath = path.join(cacheDir, `uff_${Date.now()}.mp4`);
      
      // ৪. ভিডিও ডাউনলোড
      const videoRes = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(tempVideoPath);
      videoRes.data.pipe(writer);

      writer.on("finish", () => {
        // ৫. ভিডিও পাঠানো
        api.sendMessage({
          body: `╭━━━━━━⊱🔞⊰━━━━━━╮\n   𝟏𝟖+ 𝐓𝐈𝐊𝐓𝐎𝐊 𝐕𝐈𝐃𝐄𝐎\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n🎥 এনজয় করুন চাঁদের পাহাড়!\n\n𖤍 𝐀𝐝𝐦𝐢𝐧: MD BELAL (BS Dealer)\n🏠 𝐇𝐨𝐦𝐞: KURIGRAM, BD${sig}`,
          attachment: fs.createReadStream(tempVideoPath)
        }, threadID, () => {
          // ৬. পাঠানোর পর ফাইল ডিলিট করা
          if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
        }, messageID);
      });

      writer.on("error", (err) => {
        console.error(err);
        api.sendMessage("❌ ফাইল ডাউনলোড করতে সমস্যা হয়েছে।", threadID, messageID);
      });

    } catch (error) {
      console.error("Error fetching OnlyTik video:", error);
      api.sendMessage("❌ সার্ভার এরর! দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।", threadID, messageID);
    }
  }
};
