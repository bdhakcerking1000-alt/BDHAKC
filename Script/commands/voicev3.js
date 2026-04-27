const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "voicev3",
    version: "2.0.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 1,
    role: 0,
    shortDescription: "Ultra Fast Voice Reply (Belal Custom)",
    longDescription: "নির্দিষ্ট কিছু শব্দে অটোমেটিক ভয়েস রিপ্লাই দিবে।",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, api }) {
    if (!event.body) return;

    const input = event.body.toLowerCase().trim();
    const cacheDir = path.join(__dirname, "cache", "belal_voices");
    
    // 📂 ভয়েস ম্যাপিং (আপনি আপনার পছন্দমতো আরও লিঙ্ক এখানে যোগ করতে পারবেন)
    const voiceMap = {
      // 🌟 কাস্টম ট্র্রিগার
      "magi": "https://files.catbox.moe/ecgpak.mp4",
      "মাগি": "https://files.catbox.moe/ecgpak.mp4",
      "খানকি": "https://files.catbox.moe/ecgpak.mp4",
      "khanki": "https://files.catbox.moe/ecgpak.mp4",

      // 🌙 সময় ভিত্তিক
      "good night": "https://files.catbox.moe/i29m4q.mp3",
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",

      // 👑 ব্র্যান্ডিং ট্র্রিগার (সিয়াম ভাই সরিয়ে আপনার নাম দিলে ভালো হয়, তবে আমি আপনার দেয়া লিঙ্কগুলোই রাখলাম)
      "siyam": "https://files.catbox.moe/9w6moo.mp3",
      "সিয়াম ভাই": "https://files.catbox.moe/9w6moo.mp3",
      "সিয়াম": "https://files.catbox.moe/9w6moo.mp3",
      "বেলাল": "https://files.catbox.moe/9w6moo.mp3", // আপনার নাম ট্র্রিগার

      "@everyone": "https://files.catbox.moe/par79o.mp4",
      "নিঝুম": "https://files.catbox.moe/par79o.mp4",

      // 🔥 ইমোজি ও ফানি ট্র্রিগার
      ",sex": "https://files.catbox.moe/uy7mrv.mp3",
      ",hot": "https://files.catbox.moe/m5djca.mp3",
      "s+n": "https://files.catbox.moe/ztwmnf.mp4",
      "টুকি": "https://files.catbox.moe/e8ebel.mp3",
      "আমি মাদিহা": "https://files.catbox.moe/9gyjwp.mp3",
      "নুনু": "https://files.catbox.moe/r5uz42.mp3",

      "🐍": "https://files.catbox.moe/s1k2nx.mp4",
      "😈": "https://files.catbox.moe/5rdtc6.mp3"
    };

    if (voiceMap[input]) {
      try {
        fs.ensureDirSync(cacheDir);
        const fileName = `${Buffer.from(input).toString("hex")}.mp3`;
        const filePath = path.join(cacheDir, fileName);

        // 🚀 লোকাল ক্যাশ চেক (যদি ফাইল আগে ডাউনলোড করা থাকে তবে সরাসরি পাঠাবে)
        if (fs.existsSync(filePath)) {
          return await message.reply({
            attachment: fs.createReadStream(filePath)
          });
        }

        // 📥 নতুন ফাইল ডাউনলোড
        const response = await axios.get(voiceMap[input], {
          responseType: "arraybuffer"
        });

        fs.writeFileSync(filePath, Buffer.from(response.data));

        await message.reply({
          attachment: fs.createReadStream(filePath)
        });

      } catch (error) {
        console.error("Belal Voice Engine Error:", error);
      }
    }
  }
};
