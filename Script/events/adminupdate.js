const moment = require("moment-timezone");

module.exports.config = {
  name: "adminUpdate",
  // eventType কে পরিবর্তন করে eventTypes করা হয়েছে
  eventTypes: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-call", "log:thread-color"],
  version: "20.0.1",
  credits: "Belal x Gemini",
  description: "২০+ প্রিমিয়াম ফিচার ও ৫ রকম অ্যানিমেশন ফ্রেম সহ আল্টিমেট ওএস",
  envConfig: {
    enable: true
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData, author } = event;
  const ownerID = "61577502464880"; 
  const adminGroupID = "26836635292647856"; 
  const sig = "\n┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

  // শুধুমাত্র নির্দিষ্ট ইভেন্টগুলো চেক করবে
  const targetEvents = ["log:thread-admins", "log:thread-name", "log:thread-icon", "log:thread-call"];
  if (!targetEvents.includes(logMessageType)) return;

  try {
    let actorName = "Unknown User";
    try {
        actorName = await Users.getNameUser(author) || "User";
    } catch (e) { actorName = "Messenger User"; }

    const execID = "OS-X" + Math.floor(Math.random() * 100000);
    const latency = Date.now() - (event.timestamp || Date.now());

    const animations = [
      ["[ ▓▒░ ]", "[ ░▒▓ ]", "«━━◤ ⚔️ ◢━━»"], 
      ["◈━━━━◈", "💠━━━━💠", "«━━◤ 💠 ◢━━»"],
      ["⚡━━━━⚡", "🔥━━━━🔥", "«━━◤ 🔥 ◢━━»"],
      ["✨━━━━✨", "💎━━━━💎", "«━━◤ 💎 ◢━━»"],
      ["⚙️━━━━⚙️", "📡━━━━📡", "«━━◤ 🛰️ ◢━━»"]
    ];
    const anim = animations[Math.floor(Math.random() * animations.length)];

    let title = "", status = "", impact = "", prediction = "", threat = "";

    switch (logMessageType) {
      case "log:thread-admins":
        if (logMessageData.ADMIN_EVENT == "add_admin") {
          title = "✨ 𝗡𝗘𝗪 𝗘𝗟𝗜𝗧𝗘 𝗔𝗨𝗧𝗛𝗢𝗥𝗜𝗧𝗬";
          status = "Promoted [Admin]"; impact = "★★★★★";
          threat = "🟢 Minimal"; prediction = "Stronger Governance";
        } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
          title = "👞 𝗔𝗨𝗧𝗛𝗢𝗥𝗜𝗧𝗬 𝗧𝗘𝗥𝗠𝗜𝗡𝗔𝗧𝗘𝗗";
          status = "Demoted [Member]"; impact = "★★★★☆";
          threat = "🔴 Critical"; prediction = "Power Shift Detected";
        }
        break;
      case "log:thread-name":
        title = " castles 𝗗𝗢𝗠𝗔𝗜𝗡 𝗜𝗗𝗘𝗡𝗧𝗜𝗧𝗬 𝗦𝗬𝗡𝗖";
        status = "Identity Updated"; impact = "★★☆☆☆";
        threat = "🟡 Low"; prediction = "Public Recognition Change";
        break;
      case "log:thread-icon":
        title = "🖼️ 𝗩𝗜𝗦𝗨𝗔𝗟 𝗖𝗢𝗡𝗘𝗫𝗜𝗢𝗡";
        status = "Aesthetic Shift"; impact = "★☆☆☆☆";
        threat = "🟢 Zero"; prediction = "Enhanced Group Appeal";
        break;
      case "log:thread-call":
        title = logMessageData.event === "group_call_started" ? "🤙 𝗡𝗘𝗪 𝗩𝗢𝗜𝗖𝗘 𝗦𝗘𝗦𝗦𝗜𝗢𝗡" : "📵 𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗖𝗟𝗢𝗦𝗘𝗗";
        status = "Voice Comm"; impact = "★★★☆☆";
        threat = "🟢 Safe"; prediction = "Social Interaction Boost";
        break;
    }

    if (!title) return;

    const finalMsg = `${anim[0]}  𝗦𝗘𝗡𝗧𝗜𝗘𝗡𝗖𝗘-𝗢𝗦  ${anim[1]}\n${anim[2]}\n\n` +
      `📌 𝗘𝗩𝗘𝗡𝗧: ${title}\n` +
      `👤 𝗔𝗖𝗧𝗢𝗥: ${actorName}\n` +
      `📊 𝗦𝗧𝗔𝗧𝗨𝗦: ${status}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🌐 𝗔𝗜 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
      `🔹 𝗜𝗺𝗽𝗮𝗰𝘁: ${impact}\n` +
      `🔹 𝗧𝗵𝗿𝗲𝗮𝘁: ${threat}\n` +
      `🔹 𝗣𝗿𝗲𝗱𝗶𝗰𝘁: ${prediction}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🛠️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢:\n` +
      `📶 𝗟𝗮𝘁𝗲𝗻𝗰𝐲: ${latency}ms | 🧬 𝗜𝗻𝘁𝗲𝗴𝗿𝗶𝘁𝐲: 𝟭𝟬𝟬%\n` +
      `🔐 𝗘𝗻𝗰𝗿𝘆𝗽𝘁𝗶𝗼𝗻: 𝟮𝟱𝟲-𝗕𝗶𝘁 𝗔𝗘𝗦\n` +
      `🆔 𝗘𝘅𝗲𝗰_𝗜𝗗: ${execID}\n\n` +
      `👑 Admin: BELAL (Verified)${sig}`;

    api.sendMessage(finalMsg, threadID);

    // রিপোর্ট সেকশন
    const report = `🛰️ 𝗢𝗦-𝗟𝗢𝗚 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n👤 𝗗𝗼𝗻𝗲 𝗕𝘆: ${actorName}\n📝 𝗧𝗮𝘀𝗸: ${status}\n⏰ 𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Dhaka").format("hh:mm:ss A")}\n━━━━━━━━━━━━━━━━━━\n👑 Admin: 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)${sig}`;
    
    api.sendMessage(report, ownerID);
    api.sendMessage(report, adminGroupID);

  } catch (err) { console.error("AdminUpdate Error:", err); }
};
