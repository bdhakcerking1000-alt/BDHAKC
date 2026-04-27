const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "30.0.0",
  credits: "Belal x Gemini",
  description: "২০+ নতুন ফিচার ও ৫ রকম অ্যানিমেশন সহ আল্টিমেট জেনেসিস হাব",
  dependencies: { "fs-extra": "", "path": "", "moment-timezone": "" }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = fs;
  const paths = [path.join(__dirname, "cache", "joinGif"), path.join(__dirname, "cache", "randomgif")];
  for (const p of paths) if (!existsSync(p)) mkdirSync(p, { recursive: true });
};

module.exports.run = async function({ api, event, Users }) {
  const { threadID } = event;
  const startTime = Date.now();
  const botPrefix = global.config.PREFIX || "/";
  const botName = "𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗧-𝗫𝟲𝟲𝟲";
  const sig = "\n┈──╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্্ড়ৃঁ✿⃝🪬 ╾──┈";
  
  const emojiMax = ["🔱", "💎", "🛡️", "🌀", "🛰️", "🧿", "💫", "🔥", "👑", "✨", "🌟", "⚙️", "💠", "🏆", "⚡", "🌈"];
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 🌀 ৫ রকম হাই-টেক অ্যানিমেশন ফ্রেম
  const frames = [
    ["«━━◤ ⚔️ ◢━━»", "«━━◤ ⚔️ ◢━━»", "💠━━━━━━━💠"],
    ["«━━◤ 🔥 ◢━━»", "«━━◤ 🔥 ◢━━»", "🔥━━━━━━━🔥"],
    ["«━━◤ 💎 ◢━━»", "«━━◤ 💎 ◢━━»", "💎━━━━━━━💎"],
    ["«━━◤ 🛰️ ◢━━»", "«━━◤ 🛰️ ◢━━»", "📡━━━━━━━📡"],
    ["«━━◤ 👑 ◢━━»", "«━━◤ 👑 ◢━━»", "👑━━━━━━━👑"]
  ];
  const anim = rand(frames);

  // ১. বটের এন্ট্রি (Bot Entry Logic)
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());
    const randomGifPath = path.join(__dirname, "cache", "randomgif");
    const allFiles = fs.readdirSync(randomGifPath).filter(f => [".mp4", ".gif", ".jpg", ".png"].some(ext => f.endsWith(ext)));
    const selected = allFiles.length > 0 ? fs.createReadStream(path.join(randomGifPath, rand(allFiles))) : null;

    const botEntryMsg = `${anim[0]}\n   𝗦𝗬𝗦𝗧𝗘𝗠 𝗢𝗡𝗟𝗜𝗡𝗘 🚀\n${anim[1]}\n\n` +
      `👋 আসসালামু আলাইকুম! ${botName} এখন এই রাজত্বের প্রধান সেন্টিনেল হিসেবে চার্জ নিয়েছে।\n\n` +
      `📡 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 𝗦𝗧𝗔𝗧𝗨𝗦:\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⌬ 𝗣𝗿𝗲𝗳𝗶𝘅  : [ ${botPrefix} ]\n` +
      `⌬ 𝗨𝗽𝘁𝗶𝗺𝗲  : Active 🟢\n` +
      `⌬ 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆: AES-256 Bit 🔐\n` +
      `⌬ 𝗛𝗲𝗮𝗹𝘁𝗵  : Excellent 🛡️\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👑 𝗢𝘄𝗻ער : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)\n` +
      `📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: 01913246554${sig}`;
    return api.sendMessage({ body: botEntryMsg, attachment: selected }, threadID);
  }

  // ২. নতুন মেম্বার স্বাগতম (New Member Logic)
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { threadName, participantIDs, adminIDs } = threadInfo;
    const memCount = participantIDs.length;
    const adminCount = adminIDs.length;
    const time = moment().tz("Asia/Dhaka").format("hh:mm A");
    const execID = "GX-" + Math.floor(Math.random() * 900000);
    const latency = Date.now() - startTime;

    let nameArray = [], mentions = [];
    for (let i of event.logMessageData.addedParticipants) {
      nameArray.push(i.fullName);
      mentions.push({ tag: i.fullName, id: i.userFbId });
    }

    const nextMilestone = 100 * Math.ceil((memCount + 1) / 100);
    const potential = Math.floor(Math.random() * 41) + 60; // 60-100%

    const memberMsg = `${anim[0]}\n  𝗚𝗘𝗡𝗘𝗦𝗜𝗦-𝗫 𝗣𝗢𝗥𝗧𝗔𝗟 ✨\n${anim[1]}\n\n` +
      `👋 স্বাগতম [ ${nameArray.join(', ')} ]! ${rand(emojiMax)}\n` +
      `আমাদের "Elite Clan" এ আপনাকে VIP মেম্বার হিসেবে গ্রহণ করা হলো।\n\n` +
      `📊 𝗨𝗦𝗘𝗥 𝗜𝗡𝗧𝗘𝗟𝗟𝗜𝗚𝗘𝗡𝗖𝗘:\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 𝗡𝗮𝗺𝗲   : ${nameArray.join(', ')}\n` +
      `🆔 𝗨𝗜𝗗     : ${execID}\n` +
      `📈 𝗣𝗼𝘁𝗲𝗻𝘁𝗶𝗮𝗹: ${potential}%\n` +
      `🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀   : Verified 🟢\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🏰 𝗗𝗢𝗠𝗔𝗜𝗡 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
      `🏘️ 𝗚𝗿𝗼𝘂𝗽  : ${threadName}\n` +
      `👑 𝗔𝗱𝗺𝗶𝗻𝘀 : ${adminCount} Active\n` +
      `👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: #${memCount} (Target: ${nextMilestone})\n` +
      `⏰ 𝗝𝗼𝗶𝗻𝗲𝗱 : ${time}\n\n` +
      `🚀 𝗦𝘆𝘀𝘁𝗲𝗺 𝗟𝗮𝘁𝗲𝗻𝗰𝘆: ${latency}ms\n` +
      `▒▒▒▒▒▒▒▒▒▒▒▒▒ 100%\n\n` +
      `👑 𝗔𝗱𝗺𝗶𝗻: 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)${sig}`;

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const files = fs.readdirSync(joinGifPath).filter(f => [".mp4", ".gif", ".jpg", ".png"].some(ext => f.endsWith(ext)));
    const selected = files.length > 0 ? fs.createReadStream(path.join(joinGifPath, rand(files))) : null;

    return api.sendMessage({ body: memberMsg, attachment: selected, mentions }, threadID);
  } catch (e) { console.error(e); }
};
      
