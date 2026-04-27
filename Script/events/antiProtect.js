const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "antiProtect",
  version: "6.0.0",
  credits: "Belal x Gemini",
  description: "গ্রুপের নাম ও ছবি প্রটেকশন + বেয়াদব মেম্বার কিক",
  eventType: ["log:thread-name", "log:thread-icon"],
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const { threadID, author, logMessageType, logMessageData } = event;
    const senderID = author || event.senderID;
    const botID = api.getCurrentUserID();
    
    const adminGroupID = "26836635292647856"; 
    const ownerID = "61577502464880"; 
    const sig = "\n┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

    // ১. প্রয়োজনীয় ফোল্ডার ও ফাইল পাথ
    const dir = path.join(__dirname, "cache", "antiProtect");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dataFile = path.join(dir, `${threadID}.json`);

    // ২. গ্রুপ ও এডমিন চেক
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(i => i.id);
    const botAdmin = adminIDs.includes(botID);

    if (!botAdmin) return;

    // ৩. ডাটা ব্যাকআপ লজিক
    if (!fs.existsSync(dataFile)) {
      const snap = { name: threadInfo.threadName || "", image: threadInfo.imageSrc || null };
      fs.writeFileSync(dataFile, JSON.stringify(snap, null, 2));
      return;
    }

    const oldData = JSON.parse(fs.readFileSync(dataFile));

    // ওনার বা এডমিন করলে ডাটা আপডেট হবে (কিক হবে না)
    if (adminIDs.includes(senderID) || senderID == ownerID || senderID == botID) {
      const snap = { name: threadInfo.threadName, image: threadInfo.imageSrc };
      fs.writeFileSync(dataFile, JSON.stringify(snap, null, 2));
      return;
    }

    const name = await Users.getNameUser(senderID);
    const emojiMax = ["🛡️", "🔱", "⚡", "🚫", "🚨", "⚙️", "🧿"];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // 📛 নাম প্রটেকশন
    if (logMessageType === "log:thread-name") {
      await api.setTitle(oldData.name, threadID);
      await api.removeUserFromGroup(senderID, threadID);
      
      const kickMsg = `╭━━━━━━━⊱ ${rand(emojiMax)} ⊰━━━━━━━╮\n    🔥 𝗡𝗔𝗠𝗘 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗘𝗗 🔥\n╰━━━━━━━⊱ ${rand(emojiMax)} ⊰━━━━━━━╯\n\nবেয়াদব [ ${name} ]! ⚠️\nবটের পারমিশন ছাড়া নাম চেঞ্জ করার অপরাধে তোকে গ্রুপ থেকে লাথি মেরে বের করা হলো! 👞💥\n\n🛡️ নাম আগের মতো সেট করা হয়েছে।\n👑 Admin: BELAL (Verified)${sig}`;
      api.sendMessage(kickMsg, threadID);

      const report = `🚨 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗔𝗟𝗘𝗥𝗧 🚨\n━━━━━━━━━━━━━━━━━━━━\n🏰 Group: ${threadInfo.threadName}\n👤 User: ${name}\n🆔 UID: ${senderID}\n📝 Crime: নাম পরিবর্তনের চেষ্টা\n❌ Action: Kicked Out ✅\n━━━━━━━━━━━━━━━━━━━━\nমাস্টার BELAL, ব্যবস্থা নেওয়া হয়েছে!${sig}`;
      api.sendMessage(report, ownerID);
      api.sendMessage(report, adminGroupID);
    }

    // 🖼️ ছবি প্রটেকশন
    if (logMessageType === "log:thread-icon") {
      if (oldData.image) {
        const imgRes = await axios.get(oldData.image, { responseType: "stream" });
        await api.changeGroupImage(imgRes.data, threadID);
      }
      await api.removeUserFromGroup(senderID, threadID);

      const kickMsg = `╭━━━━━━━⊱ ${rand(emojiMax)} ⊰━━━━━━━╮\n    📸 𝗜𝗖𝗢𝗡 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗘𝗗 📸\n╰━━━━━━━⊱ ${rand(emojiMax)} ⊰━━━━━━━╯\n\nকিরে [ ${name} ]! ⚠️\nগ্রুপের প্রোফাইল চেঞ্জ করার শখ? তোর এতো সাহস কোত্থেকে আসে? 😂\n\n✅ ছবি আগের মতো সেট করা হয়েছে এবং তোকে কিক মারা হয়েছে।\n👑 Admin: BELAL (Verified)${sig}`;
      api.sendMessage(kickMsg, threadID);

      const report = `🚨 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗔𝗟𝗘𝗥𝗧 🚨\n━━━━━━━━━━━━━━━━━━━━\n🏰 Group: ${threadInfo.threadName}\n👤 User: ${name}\n🆔 UID: ${senderID}\n📝 Crime: ছবি পরিবর্তনের চেষ্টা\n❌ Action: Kicked Out ✅\n━━━━━━━━━━━━━━━━━━━━${sig}`;
      api.sendMessage(report, ownerID);
      api.sendMessage(report, adminGroupID);
    }

  } catch (e) { console.error(e); }
};
