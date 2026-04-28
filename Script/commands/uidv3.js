const axios = require("axios");

module.exports = {
  config: {
    name: "uidv3",
    aliases: ["id", "info", "user"],
    version: "3.0.0",
    author: "BOTX666 🪬",
    countDown: 5,
    role: 0,
    category: "info",
    description: {
      en: "Get User UID and Profile Info with ultra speed"
    },
    guide: {
      en: "{pn} | reply | mention"
    }
  },

  onStart: async function({ api, event, usersData }) {
    return handleUID({ api, event, usersData });
  },

  onChat: async function({ event, api, usersData }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();
    const triggers = ["uidv3", "id", "uid"];
    
    if (triggers.includes(body)) {
      return handleUID({ api, event, usersData });
    }
  }
};

async function handleUID({ api, event, usersData }) {
  const startTime = Date.now();
  const { threadID, messageID, senderID, messageReply, mentions } = event;

  let uid;
  if (event.type === "message_reply") {
    uid = messageReply.senderID;
  } else if (Object.keys(mentions || {}).length > 0) {
    uid = Object.keys(mentions)[0];
  } else {
    uid = senderID;
  }

  try {
    api.setMessageReaction("🆔", messageID, () => {}, true);
    
    const name = await usersData.getName(uid);
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    const stream = await global.utils.getStreamFromURL(avatarUrl);
    
    const endTime = Date.now();
    const speed = ((endTime - startTime) / 1000).toFixed(3);

    const msgBody = `🆔 𝐔𝐒𝐄𝐑 𝐈𝐃𝐄𝐍𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐕𝟑\n━━━━━━━━━━━━━━━━━━━━\n👤 𝐍𝐚𝐦𝐞: ${name}\n🆔 𝐔𝐈𝐃: ${uid}\n⚡ 𝐒𝐩𝐞𝐞𝐝: ${speed} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬\n🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞: https://facebook.com/${uid}\n━━━━━━━━━━━━━━━━━━━━`;

    await api.sendMessage({ 
      body: msgBody, 
      attachment: stream 
    }, threadID, messageID);
    
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (error) {
    console.error(error);
    api.sendMessage(`❌ Error: Unable to fetch user data.`, threadID, messageID);
  }
}
