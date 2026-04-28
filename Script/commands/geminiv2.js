const axios = require("axios");

module.exports = {
  config: {
    name: "geminiv2",
    aliases: ["ai", "chat", "google"],
    version: "1.5.0",
    author: "BOTX666 🪬",
    countDown: 5,
    role: 0,
    category: "AI",
    guide: {
      en: "{pn} [আপনার প্রশ্ন]"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const prompt = args.join(" ");
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    if (!prompt) return api.sendMessage(`⚠️ চাঁদের পাহাড়, আমাকে কিছু জিজ্ঞাসা করুন।${sig}`, threadID, messageID);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      // API কনফিগারেশন সংগ্রহ
      const configRes = await axios.get("https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json");
      const baseApi = configRes.data?.api;

      if (!baseApi) throw new Error("API Base not found");

      // জেমিনি রেসপন্স
      const response = await axios.get(`${baseApi}/gemini?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data?.response;

      if (!answer) throw new Error("Empty response");

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(answer + sig, threadID, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          baseApi: baseApi
        });
      }, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ দুঃখিত, জেমিনি এআই এই মুহূর্তে সাড়া দিচ্ছে না।", threadID, messageID);
    }
  },

  onReply: async function({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;
    const { baseApi, author } = Reply;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    if (senderID !== author) return;
    if (!body) return;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const response = await axios.get(`${baseApi}/gemini?prompt=${encodeURIComponent(body)}`);
      const answer = response.data?.response;

      if (!answer) throw new Error("Empty response");

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(answer + sig, threadID, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          baseApi: baseApi
        });
      }, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ দুঃখিত, কথা বলতে সমস্যা হচ্ছে।", threadID, messageID);
    }
  }
};
