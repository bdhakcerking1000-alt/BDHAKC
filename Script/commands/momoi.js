const axios = require("axios");

module.exports = {
  config: {
    name: "momoi",
    aliases: ["omaigotto", "momo", "voice"],
    version: "2.0.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 8,
    role: 0,
    shortDescription: "মোমোই ভয়েস তৈরি করুন",
    longDescription: "আপনার দেওয়া টেক্সটকে কিউট মোমোই ভয়েস অডিওতে রূপান্তর করুন।",
    category: "momoi",
    guide: "{pn} <text> অথবা মেসেজে রিপ্লাই দিয়ে {pn} লিখুন"
  },

  onStart: async function ({ api, event, message, args }) {
    const { threadID, messageID, messageReply } = event;
    const text = args.join(" ") || messageReply?.body;
    const startTime = Date.now();
    
    // আপনার নতুন সিগনেচার স্টাইল
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    if (!text) return message.reply("📝 বেলাল ভাই, ভয়েস বানানোর জন্য কিছু টেক্সট দিন অথবা মেসেজে রিপ্লাই করুন!");

    try {
      // শুরুতে রিঅ্যাকশন
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const audioUrl = `https://xihad-4-x.vercel.app/Tools/Momoi?txt=${encodeURIComponent(text)}&apikey=dhn`;

      const response = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream"
      });

      const latency = Date.now() - startTime;

      // আউটপুট ক্যাপশন আপনার স্টাইলে
      const caption = `╭━━━❖✦🪬✦❖━━━╮\n  ✡️  চাঁদের 𖤍 পাহাড়  🪬\n╰━━━❖✦🪬✦❖━━━╯\n\n` +
        `🎀 𝗠𝗼𝗺𝗼𝗶 𝗩𝗼𝗶𝗰𝗲 𝗥𝗲𝗮𝗱𝘆!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱 : ${latency}ms\n` +
        `𖤍 𝗔𝗱𝗺𝗶𝗻 : BELAL ⊶ BOTX666 🪬${sig}`;

      await message.reply({
        body: caption,
        attachment: response.data,
      });

      // সফল হলে রিঅ্যাকশন
      api.setMessageReaction("✅", messageID, () => {}, true);

    } catch (error) {
      console.error("Momoi Error:", error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ বেলাল ভাই, ভয়েস তৈরি করতে সমস্যা হয়েছে! সার্ভার অফ থাকতে পারে।");
    }
  },
};
