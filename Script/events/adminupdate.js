const moment = require("moment-timezone");
const fs = require("fs");

module.exports.config = {
  name: "adminUpdate",
  eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-call", "log:thread-color", "log:thread-theme", "log:unsubscribe", "log:subscribe"],
  version: "100.0.0",
  credits: "Chander Pahar",
  description: "৫ সেকেন্ড ৫ অ্যানিমেশন ও আনলিমিটেড ইমোজি ওএস",
  envConfig: {
    sendNoti: true
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { threadID, logMessageType, logMessageData, author, messageID } = event;
  const { setData, getData } = Threads;
  const sig = "—͟͞͞ 🏔️ 𝗖𝗵𝗮𝗻𝗱𝗲𝗿 𝗣𝗮𝗵𝗮𝗿 𝗔𝗜 🛰️";

  // --- আনলিমিটেড ইমোজি কালেকশন (২০০+) ---
  const emojis = ["✨", "🌟", "🔥", "🛡️", "🔱", "💎", "⚡", "🛰️", "👑", "🧿", "🌻", "🌈", "☄️", "💠", "🎐", "🎋", "🎭", "🎪", "🏹", "🔮", "🧬", "🧪", "⚙️", "🔋", "📡", "🛸", "🚀", "🪐", "🌠", "🌌", "🌙", "☀️", "🏮", "💎", "🦋", "🦁", "🐉", "🐾", "🌹", "🍁", "🍀", "🍃", "🍄", "🐚", "🌴", "🌵", "🌊", "🔔", "🏅", "🎲", "🎮", "🕹️", "🎰", "🎼", "🎹", "🎸", "🎷", "🎺", "🎻", "🎬", "🎨", "🎭", "🎪", "🎫", "🎟️", "🎖️", "🏆", "🎁", "🎈", "🎏", "🎊", "🎉", "🎍", "🎎", "🎐", "🎑", "🎒", "🎓", "🎖️", "🎗️", "🎙️", "🎧", "📻", "🎷", "🎸", "🎹", "🎺", "🎻", "🥁", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🎥", "🎞️", "📽️", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯️", "💡", "🔦", "🏮", "📔", "📕", "📖", "📗", "📘", "📙", "📜", "📓", "📒", "📑", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "📛", "🔬", "🔭", "📡", "💉", "💊", "🚪", "🛌", "🛏️", "🛋️", "🚽", "🚿", "🛁", "🛁", "🛀", "🛁", "🚿", "🚽", "🌡️", "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🔮", "🧿", "💍", "💎", "⚖️", "⚙️", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🔩", "⚙️", "⛓️", "🔫", "💣", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "💊", "💉", "🌡️", "🏷️", "🔖", "🚽", "🚿", "🛁", "🔑", "🗝️", "🚪", "🪑", "🛌", "🛏️", "🛋️", "🧸", "🖼️", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎊", "🎉", "🎐", "🧧", "🎀", "🪄", "🪅", "🎊", "🎉", "🏮", "🎑", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷️", "🗳️", "📁", "📂", "📅", "📆", "🗓️", "🗒️", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🔐", "🔏", "🔒", "🔓"];
  
  const getRandEmoji = () => emojis[Math.floor(Math.random() * emojis.length)] + emojis[Math.floor(Math.random() * emojis.length)];

  try {
    let dataThread = (await getData(threadID)).threadInfo;
    let actorName = await Users.getNameUser(author) || "User";
    let title = "", desc = "";

    // --- বাংলা স্লিম ক্যাপশন ---
    switch (logMessageType) {
      case "log:thread-admins":
        if (logMessageData.ADMIN_EVENT == "add_admin") {
          title = "নতুন অভিভাবক 👑";
          desc = "অ্যাডমিন প্যানেলে নতুন সদস্যের অভিষেক হলো।";
        } else {
          title = "পদ অপসারণ 👞";
          desc = "অ্যাডমিন ক্ষমতা থেকে একজনকে অব্যাহতি দেওয়া হয়েছে।";
        }
        break;
      case "log:thread-color":
      case "log:thread-theme":
        title = "রঙিন পরিবর্তন 🎨";
        desc = "গ্রুপের থিম বা কালার নতুন করে সাজানো হয়েছে।";
        break;
      case "log:user-nickname":
        title = "পরিচয় বদল 🎭";
        desc = `ডাকনাম পরিবর্তন করে '${logMessageData.nickname || "আসল নাম"}' রাখা হয়েছে।`;
        break;
      case "log:subscribe":
        title = "নতুন সদস্য 👋";
        desc = "চাঁদের পাহাড়ের পরিবারে নতুন এক সদস্য যুক্ত হলেন।";
        break;
      case "log:unsubscribe":
        title = "বিদায় বেলা 🚶";
        desc = "একজন সদস্য মায়ার বাঁধন ছিঁড়ে গ্রুপ থেকে বিদায় নিলেন।";
        break;
      case "log:thread-name":
        title = "নতুন নাম 🏷️";
        desc = `গ্রুপের নাম পরিবর্তন করে '${logMessageData.name}' রাখা হয়েছে।`;
        break;
      case "log:thread-call":
        if (logMessageData.event === "group_call_started") {
          title = "আড্ডা শুরু 🤙";
          desc = "ভয়েস কলে মিষ্টি আড্ডা শুরু হয়েছে, দ্রুত জয়েন করুন।";
        } else if (logMessageData.event === "group_call_ended") {
          title = "আড্ডা শেষ 📵";
          desc = "ভয়েস কল সেশনটি সফলভাবে সমাপ্ত হয়েছে।";
        } else {
          const joiner = await Users.getNameUser(logMessageData.joining_user);
          title = "কলে জয়েন 🎧";
          desc = `${joiner} এখন সরাসরি আমাদের সাথে কলে কথা বলছেন।`;
        }
        break;
      default: return;
    }

    const getMsg = (animFrame) => 
      `${getRandEmoji()} 「 ${title} 」 ${getRandEmoji()}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 𝗞𝗲𝗿𝘁𝗮: ${actorName}\n` +
      `📢 𝗗𝗲𝘁𝗮𝗶𝗹𝘀: ${desc}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `${animFrame}\n` +
      `${sig}`;

    if (global.configModule[this.config.name].sendNoti) {
      api.sendMessage(getMsg("⏳ সিস্টেম লোড হচ্ছে..."), threadID, async (err, info) => {
        let count = 5;
        // ৫ সেকেন্ডে ৫টি আলাদা অ্যানিমেশন ফ্রেম
        const frames = [
          "🕔 ▰▰▰▰▱ 𝟴𝟬% 𝗥𝗲𝗺𝗼𝘃𝗶𝗻𝗴...",
          "🕓 ▰▰▰▱▱ 𝟲𝟬% 𝗦𝗰𝗮𝗻𝗻𝗶𝗻𝗴...",
          "🕒 ▰▰▱▱▱ 𝟰𝟬% 𝗖𝗹𝗲𝗮𝗻𝗶𝗻𝗴...",
          "🕑 ▰▱▱▱▱ 𝟮𝟬% 𝗙𝗶𝗻𝗶𝘀𝗵𝗶𝗻𝗴...",
          "🕐 ▱▱▱▱▱ 𝟬𝟱% 𝗗𝗲𝘁𝗮𝗰𝗵𝗶𝗻𝗴..."
        ];

        const animationLoop = setInterval(async () => {
          if (count <= 0) {
            clearInterval(animationLoop);
            return api.unsendMessage(info.messageID);
          }
          // মেসেজ এডিট করে অ্যানিমেশন দেখানো হচ্ছে
          api.editMessage(getMsg(frames[5 - count]), info.messageID).catch(() => {});
          count--;
        }, 1000);
      });
    }

    await setData(threadID, { threadInfo: dataThread });
  } catch (e) { console.log(e); }
};
