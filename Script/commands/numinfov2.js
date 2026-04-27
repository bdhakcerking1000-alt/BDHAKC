const axios = require("axios");

module.exports = {
  config: {
    name: "numinfov2",
    credits: "Dipto x Belal",
    hasPermssion: 0,
    commandCategory: "Information",
    usages: "[Phone Number]",
    version: "3.0.0",
    cooldowns: 7 // সার্ভার সেফটির জন্য একটু বেশি কুলডাউন
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const API_ENDPOINT = "https://www.noobs-api.rf.gd/dipto/numinfo";

    // ১. ইনপুট ভ্যালিডেশন (ফেলসেফ সিস্টেম)
    const input = args[0];
    if (!input) return api.sendMessage("🚩 চাঁদের পাহাড় নির্দেশ: সঠিক নম্বর দিন!\nউদাহরণ: !numinfo 018xxxxxxxx", threadID, messageID);

    // ২. স্মার্ট নম্বর পিউরিফায়ার (ভবিষ্যতে নম্বর ভুল হওয়ার চান্স ০%)
    let cleanNumber = input.replace(/[^0-9+]/g, ""); // সব হিজিবিজি ক্যারেক্টার রিমুভ
    if (cleanNumber.startsWith("01")) cleanNumber = "88" + cleanNumber;
    if (cleanNumber.startsWith("+")) cleanNumber = cleanNumber.replace("+", "");

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
      // ৩. টাইম-আউট সিস্টেম (যাতে এপিআই স্লো হলে বট ঝুলে না থাকে)
      const response = await axios.get(API_ENDPOINT, { 
        params: { number: cleanNumber },
        timeout: 15000 // ১৫ সেকেন্ডের বেশি লাগলে অটো ক্যান্সেল
      });

      const { data } = response;

      // ৪. ডাটা চেকিং (নিখুঁত রেজাল্ট নিশ্চিতকরণ)
      if (!data || !data.info || !Array.isArray(data.info) || data.info.length === 0) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(`⚠️ "${cleanNumber}" নম্বরের কোনো তথ্য পাবলিক ডাটাবেজে পাওয়া যায়নি।`, threadID, messageID);
      }

      // ৫. ডাটা স্টাইলিশ ফরম্যাটিং
      let resultBody = `🛡️ 𝐈𝐏 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 𝐑𝐄𝐏𝐎𝐑𝐓\n━━━━━━━━━━━━━━━━━━\n`;
      resultBody += `📱 𝐒𝐜𝐚𝐧𝐧𝐞𝐝: ${cleanNumber}\n\n`;

      data.info.forEach((res, index) => {
        const name = res.name || "🔒 Private Name";
        const type = res.type || "Standard";
        resultBody += `[${index + 1}] 👤 𝐍𝐚𝐦𝐞: ${name}\n`;
        resultBody += `   🏷️ 𝐓𝐚𝐠: ${type}\n`;
        if (res.address) resultBody += `   📍 𝐋𝐨𝐜: ${res.address}\n`;
        resultBody += `━━━━━━━━━━━━━━━━━━\n`;
      });

      resultBody += `✨ 𝐃𝐨𝐧𝐞 𝐛𝐲 𝐁𝐞𝐥𝐚𝐥 𝐁𝐨𝐬𝐬 ✨`;

      // ৬. ইন্টেলিজেন্ট ইমেজ হ্যান্ডলিং
      const msgObject = { body: resultBody };
      
      if (data.image && data.image.startsWith("http")) {
        try {
          const imageRes = await axios.get(data.image, { 
            responseType: "stream",
            timeout: 8000 
          });
          msgObject.attachment = imageRes.data;
        } catch (imgError) {
          console.error("Image loading skipped due to timeout/error");
        }
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(msgObject, threadID, messageID);

    } catch (error) {
      api.setMessageReaction("⚠️", messageID, () => {}, true);
      
      // এরর মেসেজ যদি এপিআই থেকে আসে
      let errorMessage = "🚨 এপিআই সার্ভারে সমস্যা হচ্ছে।";
      if (error.code === 'ECONNABORTED') errorMessage = "⏱️ সার্ভার রেসপন্স করতে অনেক সময় নিচ্ছে।";
      if (error.response?.status === 404) errorMessage = "❌ সার্ভার লিঙ্কটি আর কাজ করছে না।";

      return api.sendMessage(`${errorMessage}\nপরে আবার চেষ্টা করুন।`, threadID, messageID);
    }
  }
};
