const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "editv3",
    aliases: ["ai-edit", "v3edit"],
    version: "3.0.0",
    author: "BOTX666 🪬",
    countDown: 15,
    role: 0,
    shortDescription: { en: "AI Image Editor V3" },
    longDescription: { en: "Seedream V4 AI ব্যবহার করে প্রফেশনালভাবে ছবি এডিট করুন।" },
    category: "image",
    guide: {
      en: "ছবির উপরে রিপ্লাই দিয়ে লিখুন: {pn} <কি পরিবর্তন করতে চান>"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const { threadID, messageID, messageReply, type } = event;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    // ১. ছবি চেক
    const hasPhoto = type === "message_reply" && messageReply?.attachments?.[0]?.type === "photo";
    if (!hasPhoto) {
      return message.reply(`❌ চাঁদের পাহাড়, এডিট করার জন্য একটি ছবির ওপর রিপ্লাই দিন।${sig}`);
    }

    // ২. প্রম্পট বা কমান্ড চেক
    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply(`❌ ছবিটিতে আপনি কী পরিবর্তন করতে চান তা প্রম্পটে লিখে দিন।${sig}`);
    }

    const model = "seedream v4 edit";
    const imageUrl = messageReply.attachments[0].url;

    try {
      // কাজের শুরুতে রিঅ্যাকশন
      api.setMessageReaction("⏳", messageID, () => {}, true);

      // ৩. এপিআই থেকে এডিটেড ইমেজ রিকোয়েস্ট
      const res = await axios.get("https://fluxcdibai-1.onrender.com/generate", {
        params: { prompt, model, imageUrl },
        timeout: 120000
      });

      const resultUrl = res.data?.data?.imageResponseVo?.url;

      if (!resultUrl) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply("❌ দুঃখিত, ছবি এডিট করা সম্ভব হয়নি। এপিআই রেসপন্স পাওয়া যায়নি।");
      }

      // ৪. ইমেজ ক্যাশ ফোল্ডারে সেভ করা
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const cachePath = path.join(cacheDir, `editv3_${Date.now()}.png`);
      
      const imgRes = await axios.get(resultUrl, { responseType: "arraybuffer" });
      await fs.writeFile(cachePath, Buffer.from(imgRes.data));

      // কাজ শেষ হলে সাকসেস রিঅ্যাকশন
      api.setMessageReaction("✅", messageID, () => {}, true);

      // ৫. ছবি পাঠানো এবং ফাইল ডিলিট করা
      await message.reply({
        body: `🎨 𝐈𝐦𝐚𝐠𝐞 𝐄𝐝𝐢𝐭𝐞𝐝 𝐕𝟑 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲${sig}`,
        attachment: fs.createReadStream(cachePath)
      }, () => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      });

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ এডিট করার প্রসেসে একটি এরর হয়েছে! পরে আবার চেষ্টা করুন।");
    }
  }
};
