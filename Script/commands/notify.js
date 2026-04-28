const axios = require("axios");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "notify",
    aliases: ["announcement", "broadcaster"],
    version: "5.5.0",
    author: "BOTX666 🪬",
    role: 2, // Admin only
    description: "Send professional notification to all groups with 2-way reply system",
    category: "system",
    guide: {
      en: "{pn} [আপনার বার্তা]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const msg = args.join(" ");
    
    // সময় ও তারিখ সেটআপ
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    if (!msg) return api.sendMessage(`⚠️ চাঁদের পাহাড়, নোটিফিকেশন পাঠানোর জন্য একটি বার্তা দিন।${sig}`, threadID, messageID);

    const content = `📢 𝐆𝐋𝐎𝐁𝐀𝐋 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 📢\n${"━".repeat(20)}\n💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${msg}\n\n⚠️ এই মেসেজটি রিপ্লাই দিয়ে আপনি সরাসরি অ্যাডমিনকে উত্তর দিতে পারেন।${sig}`;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groups = threads.filter(t => t.isGroup);

      let sent = 0, failed = 0;

      for (const g of groups) {
        try {
          const sentMsg = await api.sendMessage(content, g.threadID);
          global.GoatBot.onReply.set(sentMsg.messageID, {
            commandName: this.config.name,
            type: "gcToOwner",
            groupID: g.threadID
          });
          sent++;
        } catch {
          failed++;
        }
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(`✅ নোটিফিকেশন সফলভাবে পাঠানো হয়েছে।\n👥 গ্রুপ সংখ্যা: ${sent}\n❌ ব্যর্থ: ${failed}${sig}`, threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ ত্রুটি: " + e.message, threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { body, attachments, threadID, senderID, messageID } = event;
    const ownerID = "61586540721576"; // আপনার এফবি ইউআইডি এখানে ঠিক আছে

    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ ${time}`;

    try {
      // ১. গ্রুপ থেকে অ্যাডমিন এর কাছে রিপ্লাই
      if (Reply.type === "gcToOwner") {
        const userInfo = await api.getUserInfo(senderID);
        const name = userInfo[senderID]?.name || "Unknown User";

        let forwardMsg = `📩 𝐍𝐞𝐰 𝐑𝐞𝐩𝐥𝐲 𝐅𝐫𝐨𝐦 𝐆𝐫𝐨𝐮𝐩\n${"━".repeat(20)}\n👤 𝐔𝐬𝐞𝐫: ${name}\n🆔 𝐈𝐃: ${senderID}\n💬 𝐌𝐬𝐠: ${body || "[ইমেজ/ফাইল]"}${sig}`;

        const files = await downloadAll(attachments);
        const sentAdminMsg = await api.sendMessage({ body: forwardMsg, attachment: files }, ownerID, () => cleanup(files));

        global.GoatBot.onReply.set(sentAdminMsg.messageID, {
          commandName: this.config.name,
          type: "ownerToGC",
          groupID: threadID
        });
        api.setMessageReaction("📩", messageID, () => {}, true);
      }

      // ২. অ্যাডমিন থেকে গ্রুপ এর কাছে রিপ্লাই
      else if (Reply.type === "ownerToGC") {
        if (senderID !== ownerID) return;

        let replyMsg = `📩 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐅𝐫𝐨𝐦 𝐎𝐰𝐧𝐞𝐫\n${"━".repeat(20)}\n💬 ${body || "[ইমেজ/ফাইল]"}${sig}`;

        const files = await downloadAll(attachments);
        const sentMsg = await api.sendMessage({ body: replyMsg, attachment: files }, Reply.groupID, () => cleanup(files));

        global.GoatBot.onReply.set(sentMsg.messageID, {
          commandName: this.config.name,
          type: "gcToOwner",
          groupID: Reply.groupID
        });
        api.setMessageReaction("✅", messageID, () => {}, true);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

// --- হেল্পার ফাংশন ---
async function downloadAll(attachments) {
  if (!attachments?.length) return [];
  let files = [];
  for (const att of attachments) {
    try {
      let ext = att.type === "photo" ? "jpg" : att.type === "video" ? "mp4" : att.type === "audio" ? "mp3" : "dat";
      const filePath = path.join(__dirname, `cache/notif_${Date.now()}.${ext}`);
      const res = await axios.get(att.url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));
      files.push(fs.createReadStream(filePath));
    } catch (e) {
      console.error(e.message);
    }
  }
  return files;
}

function cleanup(files) {
  files.forEach(f => {
    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
  });
}
