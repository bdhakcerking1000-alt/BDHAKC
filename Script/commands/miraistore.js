const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://mirai-store.onrender.com";
const ADMINS = ["61582708907708"]; // আপনার UID নিশ্চিত করুন

module.exports.config = {
  name: "miraistore",
  version: "3.5.0",
  hasPermission: 0, 
  credits: "Rx x Belal",
  description: "মিরাই কমান্ড স্টোর: সার্চ, আপলোড, লাইক এবং সরাসরি ইনস্টল করুন",
  commandCategory: "System",
  usages: "[search | upload | install | trending | like]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;
  const sub = args[0]?.toLowerCase();

  // ১. হেল্প মেনু (ইউআই আপডেট)
  if (!sub) {
    const helpMsg = `🛒 𝐌𝐈𝐑𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐒𝐓𝐎𝐑𝐄
━━━━━━━━━━━━━━━━━━
🔍 !miraistore search <নাম/আইডি>
📥 !miraistore install <আইডি> (নতুন!)
📤 !miraistore upload <ফাইল নাম>
🔥 !miraistore trending
❤️ !miraistore like <আইডি>
🗑️ !miraistore delete <আইডি> <সিক্রেট>
━━━━━━━━━━━━━━━━━━
বসের নির্দেশে সেরা কমান্ডগুলো খুঁজুন!`;
    return api.sendMessage(helpMsg, threadID, messageID);
  }

  // ২. অটো-ইনস্টল সিস্টেম (সবচেয়ে শক্তিশালী ফিচার)
  if (sub === "install") {
    if (!ADMINS.includes(senderID)) return api.sendMessage("❌ শুধুমাত্র বসের অনুমতি আছে কমান্ড ইনস্টল করার।", threadID, messageID);
    const id = args[1];
    if (!id) return api.sendMessage("❌ কমান্ডের ID দিন। উদাহরণ: !miraistore install 102", threadID, messageID);

    try {
      const res = await axios.get(`${API_BASE}/miraistore/search?q=${id}`);
      const data = res.data;
      if (!data || !data.rawUrl) return api.sendMessage("❌ কমান্ডটি পাওয়া যায়নি।", threadID, messageID);

      const code = (await axios.get(data.rawUrl)).data;
      const fileName = data.name.endsWith(".js") ? data.name : `${data.name}.js`;
      const filePath = path.join(__dirname, fileName);

      fs.writeFileSync(filePath, code, "utf8");
      return api.sendMessage(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐈𝐧𝐬𝐭𝐚𝐥𝐥𝐞𝐝!\n━━━━━━━━━━━━━━━━━━\n📦 Name: ${data.name}\n📂 Path: commands/${fileName}\n\nবট রিস্টার্ট দিলে কমান্ডটি কাজ শুরু করবে!`, threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ ইনস্টল করতে সমস্যা হয়েছে। সার্ভার চেক করুন।", threadID, messageID);
    }
  }

  // ৩. আপলোড সিস্টেম (উন্নত মেটাডাটা এক্সট্রাকশন)
  if (sub === "upload") {
    if (!ADMINS.includes(senderID)) return api.sendMessage("❌ আপলোড করার পারমিশন আপনার নেই।", threadID, messageID);
    const cmdName = args[1];
    if (!cmdName) return api.sendMessage("📁 ফাইলের নাম দিন (যেমন: antiraid.js)", threadID, messageID);

    const filePath = path.join(__dirname, cmdName.endsWith(".js") ? cmdName : cmdName + ".js");
    if (!fs.existsSync(filePath)) return api.sendMessage("❌ `commands` ফোল্ডারে এই ফাইলটি নেই।", threadID, messageID);

    try {
      const data = fs.readFileSync(filePath, "utf8");
      const wait = await api.sendMessage("📡 কোড স্ক্যান করা হচ্ছে...", threadID);

      const pasteRes = await axios.post("https://pastebin-api.vercel.app/paste", { text: data });
      const rawUrl = `https://pastebin-api.vercel.app/raw/${pasteRes.data.id}`;

      const storeRes = await axios.post(`${API_BASE}/miraistore/upload`, { rawUrl });
      api.unsendMessage(wait.messageID);

      return api.sendMessage(`✅ স্টোরে আপলোড সম্পন্ন!\n🆔 ID: ${storeRes.data.id}\n🌐 URL: ${rawUrl}`, threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ আপলোড ফেল হয়েছে!", threadID, messageID);
    }
  }

  // ৪. ট্রেন্ডিং সিস্টেম
  if (sub === "trending" || sub === "trend") {
    try {
      const res = await axios.get(`${API_BASE}/miraistore/trending?limit=5`);
      let msg = "🔥 𝐓𝐎𝐏 𝐓𝐑𝐄𝐍𝐃𝐈𝐍𝐆 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒\n━━━━━━━━━━━━━━━━━━\n";
      res.data.forEach((cmd, i) => {
        msg += `${i + 1}. ${cmd.name.toUpperCase()}\n🆔 ID: ${cmd.id} | ❤️ ${cmd.likes}\n━━━━━━━━━━━━━━━━━━\n`;
      });
      return api.sendMessage(msg, threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ সার্ভার রেসপন্স করছে না।", threadID, messageID);
    }
  }

  // ৫. সার্চ সিস্টেম (উন্নত ইউআই)
  const query = args.join(" ").replace(sub, "").trim();
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}`);
    const d = res.data;

    if (Array.isArray(d)) {
      let msg = `📂 ফলাফল পাওয়া গেছে: ${d.length}টি\n━━━━━━━━━━━━━━━━━━\n`;
      d.forEach(c => msg += `🔹 ${c.name} (ID: ${c.id})\n`);
      return api.sendMessage(msg, threadID, messageID);
    }

    const info = `📝 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
━━━━━━━━━━━━━━━━━━
📂 Name: ${d.name}
👤 Author: ${d.author}
📦 Category: ${d.category}
📊 Views: ${d.views} | ❤️ Likes: ${d.likes}
🆔 ID: ${d.id}
━━━━━━━━━━━━━━━━━━
🔗 URL: ${d.rawUrl}
💡 টিপস: ইনস্টল করতে !miraistore install ${d.id} লিখুন।`;
    return api.sendMessage(info, threadID, messageID);
  } catch (e) {
    return api.sendMessage("❌ কোনো তথ্য পাওয়া যায়নি।", threadID, messageID);
  }
};
