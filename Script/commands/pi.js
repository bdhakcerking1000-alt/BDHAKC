const axios = require('axios');
const moment = require("moment-timezone");

const piVoiceModels = {
  1: "Pi 1 ✨",
  2: "Pi 2 ✨",
  3: "Pi 3 ✨",
  4: "Pi 4",
  5: "Pi 5",
  6: "Pi 6",
  7: "Pi 7",
  8: "Pi 8"
};

module.exports = {
  config: {
    name: "pi",
    aliases: ["pi-ai", "voiceai"],
    version: "2.1.0",
    author: "BOTX666 🪬",
    countDown: 5,
    role: 0,
    description: {
      en: "Chat with Pi AI using text or voice. Supports model selection and voice toggling."
    },
    category: "ai",
    guide: {
      en: "   {pn} <আপনার বার্তা>\n   {pn} setvoice on|off|<1–8>\n   {pn} list\n\nউদাহরণ:\n   {pn} Hello Pi!\n   {pn} setvoice on\n   {pn} setvoice 3"
    }
  },

  onStart: async function ({ api, message, args, event, usersData }) {
    const userId = event.senderID;
    const input = args.join(" ").trim();
    const { messageID } = event;

    // সময় ও তারিখ সেটআপ (Asia/Dhaka)
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    if (!input) return message.reply(`❌ চাঁদের পাহাড়, কিছু একটা লিখে পাঠান অথবা 'list' লিখে ভয়েস মডেল দেখুন।${sig}`);

    let voiceSetting = await usersData.get(userId, "data.pi_voice");
    if (!voiceSetting) {
      voiceSetting = { voice: false, model: 1 };
      await usersData.set(userId, voiceSetting, "data.pi_voice");
    }

    // ভয়েস সেটিংস কনফিগারেশন
    if (input.toLowerCase().startsWith("setvoice")) {
      const cmd = input.split(" ")[1]?.toLowerCase();
      if (!cmd) return message.reply(`⚠️ সঠিক ব্যবহার: setvoice on/off/1-8${sig}`);

      if (cmd === "on") {
        voiceSetting.voice = true;
      } else if (cmd === "off") {
        voiceSetting.voice = false;
      } else {
        const modelNum = parseInt(cmd);
        if (!piVoiceModels[modelNum]) return message.reply(`⚠️ ১ থেকে ৮ পর্যন্ত মডেল সিলেক্ট করুন।${sig}`);
        voiceSetting.voice = true;
        voiceSetting.model = modelNum;
      }

      await usersData.set(userId, voiceSetting, "data.pi_voice");
      api.setMessageReaction("⚙️", messageID, () => {}, true);
      return message.reply(`✅ 𝐏𝐢 𝐕𝐨𝐢𝐜𝐞 𝐔𝐩𝐝𝐚𝐭𝐞𝐝!\n━━━━━━━━━━━━━━\n🔊 𝐕𝐨𝐢𝐜𝐞: ${voiceSetting.voice ? "ON" : "OFF"}\n🎙️ 𝐌𝐨𝐝𝐞𝐥: ${piVoiceModels[voiceSetting.model]}${sig}`);
    }

    // লিস্ট বা স্ট্যাটাস দেখা
    if (input.toLowerCase() === "list") {
      const usage = await usersData.get(userId, "data.pi_usageCount") || 0;
      const modelList = Object.entries(piVoiceModels).map(([id, name]) => `🔢 ${id} = ${name}`).join("\n");

      return message.reply(`📊 𝐏𝐢 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬 📊\n━━━━━━━━━━━━━━\n🔊 𝐕𝐨𝐢𝐜𝐞: ${voiceSetting.voice ? "ON" : "OFF"}\n🎙️ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭: ${piVoiceModels[voiceSetting.model]}\n📈 𝐔𝐬𝐞𝐝: ${usage} times\n\n🗂️ 𝐕𝐨𝐢𝐜𝐞 𝐌𝐨𝐝𝐞𝐥𝐬:\n${modelList}${sig}`);
    }

    // AI এর সাথে চ্যাট শুরু
    api.setMessageReaction("💭", messageID, () => {}, true);
    const session = `pi-${userId}`;

    try {
      const res = await callPi(input, session, voiceSetting.voice, voiceSetting.model);
      if (!res?.text) throw new Error("No response");

      const currentCount = await usersData.get(userId, "data.pi_usageCount") || 0;
      await usersData.set(userId, currentCount + 1, "data.pi_usageCount");

      const replyPayload = { body: `💠 𝐏𝐢 𝐀𝐈 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞\n━━━━━━━━━━━━━━\n${res.text}${sig}` };

      if (voiceSetting.voice && res.audio) {
        replyPayload.attachment = await global.utils.getStreamFromURL(res.audio);
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return message.reply(replyPayload, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: userId,
          session
        });
      });

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`⚠️ Pi AI এখন ব্যস্ত আছে, পরে চেষ্টা করুন।${sig}`);
    }
  },

  onReply: async function ({ api, message, event, Reply, usersData }) {
    const userId = event.senderID;
    if (userId !== Reply.author) return;

    const query = event.body?.trim();
    if (!query) return;

    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ ${time}`;

    const voiceSetting = await usersData.get(userId, "data.pi_voice") || { voice: false, model: 1 };
    const session = Reply.session || `pi-${userId}`;

    try {
      const res = await callPi(query, session, voiceSetting.voice, voiceSetting.model);
      if (!res?.text) return;

      const replyPayload = { body: `💠 𝐏𝐢 𝐀𝐈 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞\n━━━━━━━━━━━━━━\n${res.text}${sig}` };

      if (voiceSetting.voice && res.audio) {
        replyPayload.attachment = await global.utils.getStreamFromURL(res.audio);
      }

      return message.reply(replyPayload, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: userId,
          session
        });
      });
    } catch (err) {
      return message.reply(`❌ এরর হয়েছে!${sig}`);
    }
  }
};

async function callPi(query, session, voice = false, model = 1) {
  const { data: { public: baseUrl } } = await axios.get("https://raw.githubusercontent.com/Tanvir0999/stuffs/refs/heads/main/raw/addresses.json");
  const { data } = await axios.get(`${baseUrl}/pi?query=${encodeURIComponent(query)}&session=${encodeURIComponent(session)}&voice=${voice}&model=${model}`);
  return data.data;
}
