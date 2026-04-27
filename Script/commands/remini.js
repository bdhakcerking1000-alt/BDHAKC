const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "remini",
    aliases: ["upscale", "hd", "enhance"],
    version: "2.5.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 15,
    role: 0,
    category: "AI",
    shortDescription: { en: "ছবির কোয়ালিটি HD করুন" },
    longDescription: { en: "Enhance or restore blurry/low-quality images using Remini AI technology." },
    guide: { en: "{pn} [url] অথবা ছবিতে রিপ্লাই দিন" }
  },

  onStart: async function ({ api, message, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const startTime = Date.now();
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    let imgUrl;
    if (messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = messageReply.attachments[0].url;
    } else if (args[0]?.startsWith("http")) {
      imgUrl = args[0];
    }

    if (!imgUrl) {
      return message.reply("⚠️ বেলাল ভাই, যে ছবিটি HD করতে চান সেটিতে রিপ্লাই দিন অথবা ছবির লিঙ্ক দিন।");
    }

    // প্রিমিয়াম ওয়েটিং মেসেজ
    const waitMsgBody = `╭━━━❖✦🪬✦❖━━━╮\n  ✡️  চাঁদের 𖤍 পাহাড়  🪬\n╰━━━❖✦🪬✦❖━━━╯\n\n🔄 আপনার ছবিটি HD করা হচ্ছে...\nদয়া করে কিছুক্ষণ অপেক্ষা করুন।⏳`;
    const waitMsg = await message.reply(waitMsgBody);
    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const baseUrl = await mahmud();
      const apiUrl = `${baseUrl}/api/remini?imgUrl=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, { responseType: "stream" });
      
      const processTime = ((Date.now() - startTime) / 1000).toFixed(2);
      api.setMessageReaction("✅", messageID, () => {}, true);

      // ফাইনাল আউটপুট ডিজাইন
      const successMsg = `╭━━━❖✦✨✦❖━━━╮\n   ✨ 𝗥𝗘𝗠𝗜𝗡𝗜 𝗔𝗜 𝗛𝗗 ✨\n╰━━━❖✦✨✦❖━━━╯\n\n` +
        `✅ বস! আপনার ছবি সফলভাবে এনহ্যান্স করা হয়েছে।\n\n` +
        `📊 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱 : ${processTime}s\n` +
        `🌀 𝗠𝗼𝗱𝗲  : Ultra HD\n\n` +
        `𖤍 𝗔𝗱𝗺𝗶𝗻 : BELAL ⊶ BOTX666 🪬${sig}`;

      await message.reply({
        body: successMsg,
        attachment: res.data
      });

      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);

    } catch (error) {
      console.error(error);
      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
      api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply("❌ দুঃখিত বেলাল ভাই, ছবিটি প্রসেস করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  }
};
