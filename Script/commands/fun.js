const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  try {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
  } catch (e) {
    return "https://api.mahmud.xyz"; // Fallback API
  }
};

module.exports = {
  config: {
    name: "fun",
    aliases: ["dig", "funny", "editfun"],
    version: "2.1.0",
    author: "BOTX666 🪬",
    role: 0,
    category: "fun",
    countDown: 10,
    guide: {
      en: "{pn} [টাইপ] [মেনশন/রিপ্লাই]\nলিস্ট দেখতে: {pn} list"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, messageReply, mentions, senderID } = event;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
    const type = args[0]?.toLowerCase();

    if (!type) return api.sendMessage(`⚠️ একটি টাইপ দিন অথবা লিস্ট দেখতে 'fun list' লিখুন।${sig}`, threadID, messageID);

    // ১. সব ইফেক্টের লিস্ট দেখার সিস্টেম
    if (type === "list") {
      try {
        const apiUrl = await baseApiUrl();
        const res = await axios.get(`${apiUrl}/api/dig/list`);
        const types = res.data.types || [];
        const formattedList = types.map((t, i) => `✦ ${i + 1}. ${t.toUpperCase()}`).join("\n");
        return api.sendMessage(`╭━━⊱ 𝐅𝐔𝐍 𝐄𝐅𝐅𝐄𝐂𝐓𝐒 ⊰━━╮\n\n${formattedList}\n\n╰━━━━━━━━━━━━━━━╯${sig}`, threadID, messageID);
      } catch (err) {
        return api.sendMessage(`❌ লিস্ট লোড করতে সমস্যা হয়েছে!${sig}`, threadID, messageID);
      }
    }

    // ২. টার্গেট আইডি নির্ধারণ
    let id = senderID;
    let id2;

    if (messageReply) {
      id2 = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];
    } else if (args[1]) {
      id2 = args[1];
    } else {
      // কিছু ক্যাটাগরি আছে যা মেনশন ছাড়াও কাজ করে (সিঙ্গেল ইউজার)
      id2 = senderID; 
    }

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      const apiUrl = await baseApiUrl();
      
      // ৩. এপিআই ইউআরএল তৈরি (ডাবল ইউজার বনাম সিঙ্গেল ইউজার লজিক)
      const doubleUserTypes = ["kiss", "fuse", "buttslap", "slap", "bed", "spank"];
      const url = doubleUserTypes.includes(type)
        ? `${apiUrl}/api/dig?type=${type}&user=${id}&user2=${id2}`
        : `${apiUrl}/api/dig?type=${type}&user=${id2}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const filePath = path.join(cacheDir, `fun_${Date.now()}.png`);
      
      await fs.writeFile(filePath, Buffer.from(response.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      // ৪. আউটপুট মেসেজ
      return api.sendMessage({
        body: `✨ 𝐅𝐮𝐧𝐧𝐲 𝐄𝐟𝐟𝐞𝐜𝐭: ${type.toUpperCase()} ⚡\n━━━━━━━━━━━━━━━${sig}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ দুঃখিত, এই ইফেক্টটি তৈরি করা সম্ভব হয়নি।${sig}`, threadID, messageID);
    }
  }
};
