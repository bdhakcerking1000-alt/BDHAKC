const axios = require("axios");
const moment = require("moment-timezone");

const getBaseUrl = async () => {
  try {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
    return base.data.mahmud;
  } catch (e) {
    return "https://api.mahmud.xyz"; // Fallback URL
  }
};

module.exports = {
  config: {
    name: "memev2",
    aliases: ["memes", "funnymeme"],
    version: "2.1.0",
    author: "BOTX666 🪬",
    countDown: 10,
    role: 0,
    category: "fun",
    shortDescription: { en: "Get a random funny meme" },
    guide: { en: "{pn}" }
  },

  onStart: async function({ message, event, api }) {
    const { threadID, messageID } = event;
    
    // সময় ও তারিখ সিস্টেম
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const apiUrl = await getBaseUrl();
      const res = await axios.get(`${apiUrl}/api/meme`);
      const imageUrl = res.data?.imageUrl;

      if (!imageUrl) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ এই মুহূর্তে কোনো মিম পাওয়া যাচ্ছে না।${sig}`);
      }

      // ইমেজ স্ট্রিম সংগ্রহ
      const stream = await axios({
        method: "GET",
        url: imageUrl,
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      api.setMessageReaction("✅", messageID, () => {}, true);

      await api.sendMessage({
        body: `🐸 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐦𝐞𝐦𝐞 ⚡${sig}`,
        attachment: stream.data
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ মিম সংগ্রহ করতে যান্ত্রিক ত্রুটি হয়েছে।${sig}`);
    }
  }
};
