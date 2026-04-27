const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "dalle",
    version: "3.1.0",
    credits: "Chander Pahar x Dipto",
    hasPermssion: 0,
    usePrefix: true,
    prefix: true,
    description: "AI image generation",
    commandCategory: "AI",
    usages: "[prompt]",
    cooldowns: 10,
  },

  run: async ({ api, event, args }) => {
    const { threadID, messageID, messageReply } = event;
    
    let prompt = args.join(" ");
    if (!prompt && messageReply) prompt = messageReply.body;
    
    if (!prompt) return api.sendMessage("❌ অনুগ্রহ করে আপনি কী ধরনের ছবি তৈরি করতে চান তা লিখুন।", threadID, messageID);

    const cookies = [
      "1WMSMa5rJ9Jikxsu_KvCxWmb0m4AwilqsJhlkC1whxRDp2StLDR-oJBnLWpoppENES3sBh9_OeFE6BT-Kzzk_46_g_z_NPr7Du63M92maZmXZYR91ymjlxE6askzY9hMCdtX-9LK09sUsoqokbOwi3ldOlm0blR_0VLM3OjdHWcczWjvJ78LSUT7MWrdfdplScZbtHfNyOFlDIGkOKHI7Bg"
    ];
    const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];

    const waitMsg = await api.sendMessage("⏳ আপনার ছবি তৈরি করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", threadID);

    try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/dalle?prompt=${encodeURIComponent(prompt)}&key=dipto008&cookies=${randomCookie}`);
      
      const imageUrls = response.data.imgUrls || [];

      if (!imageUrls.length || imageUrls.length === 0) {
        api.unsendMessage(waitMsg.messageID);
        return api.sendMessage("❌ ছবি তৈরি করা সম্ভব হয়নি। কুকি নষ্ট হয়েছে অথবা এআই আপনার প্রম্পটটি গ্রহণ করেনি।", threadID, messageID);
      }

      const images = [];
      for (const url of imageUrls) {
        const imgRes = await axios.get(url, { responseType: 'stream' });
        images.push(imgRes.data);
      }

      api.unsendMessage(waitMsg.messageID);
      return api.sendMessage({
        body: `✅ আপনার অনুরোধকৃত ছবি তৈরি সম্পন্ন হয়েছে।\n━━━━━━━━━━━━━━━\n📝 প্রম্পট: ${prompt}`,
        attachment: images
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      api.unsendMessage(waitMsg.messageID);
      api.sendMessage(`🚨 ত্রুটি: ছবি তৈরি করা যায়নি। বিস্তারিত: ${error.message}`, threadID, messageID);
    }
  }
};
