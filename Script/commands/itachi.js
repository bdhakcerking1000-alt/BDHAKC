const axios = require("axios");

module.exports = {
  config: {
    name: "itachi",
    aliases: ["uchiha", "itachivid"],
    version: "2.0.0",
    author: "BOTX666 🪬",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Random Itachi Uchiha videos" },
    category: "Anime",
    guide: {
      en: "{pn} অথবা {pn} <কিওয়ার্ড>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
    const EMOJIS = ["🔥", "⚡", "🖤", "👑", "💥", "👁️"];
    const EMOJI = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    // ১. কিওয়ার্ড সেট করা
    let keyword = "itachi";
    if (args.length > 0) keyword = `itachi ${args.join(" ")}`;

    // প্রসেসিং শুরু হলে রিঅ্যাকশন
    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      // ২. এপিআই থেকে ভিডিও ডেটা সংগ্রহ
      const res = await axios.get(
        `https://short-video-api-by-arafat.vercel.app/arafat?keyword=${encodeURIComponent(keyword)}`,
        { timeout: 20000 }
      );

      if (!Array.isArray(res.data) || res.data.length === 0) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(`❌ দুঃখিত চাঁদের পাহাড়, কোনো ভিডিও পাওয়া যায়নি।${sig}`, threadID, messageID);
      }

      // ৩. র‍্যান্ডম ভিডিও নির্বাচন
      const videoData = res.data[Math.floor(Math.random() * res.data.length)];
      if (!videoData.videoUrl) throw new Error("Video URL missing");

      // ৪. ভিডিও পাঠানো
      const stream = await global.utils.getStreamFromURL(videoData.videoUrl);

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: `${EMOJI} 𝐈𝐭𝐚𝐜𝐡𝐢 𝐔𝐜𝐡𝐢𝐡𝐚 𝐄𝐝𝐢𝐭\n━━━━━━━━━━━━━━━\n⏱️ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${videoData.duration || "N/A"}s${sig}`,
        attachment: stream
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      
      // এরর মেসেজ
      const errorMsg = error.response ? "সার্ভার রেসপন্স দিচ্ছে না।" : "বটের সেন্ডিং ব্লক থাকতে পারে।";
      return api.sendMessage(`❌ ত্রুটি: ${errorMsg}${sig}`, threadID, messageID);
    }
  }
};
