let antiGaliStatus = true; 
let offenseTracker = {}; 

const ADMIN_REPORT_GROUP_ID = "26836635292647856"; 

const badWords = [
  "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","চুদামারান","চুদির","চুত","চুদি",
  "চুতমারানি","চুদের বাচ্চা","shawya","বালের","বালের ছেলে","বালছাল","মাগীর ছেলে","রান্ডি",
  "রান্দির ছেলে","বেশ্যা","বেশ্যাপনা","khanki","mgi","fuck","fck","mc","bc","xhudas",
  "abal","fucking","motherfucker","guyar","mfer","motherfuer","mthrfckr","putki","bastard",
  "bessa","hijra","a*hole","dick","cock","prick","pussy","cunt","fag","faggot",
  "khankir pola","khanki magi","গাণ্ডু","বাল","শুয়োরের বাচ্চা","তোর মারে চুদি","খানকির ছেলে",
  "মাদারচোদ","মাউগির পুত","পুটকি মারা","গুয়ামারা","বেজন্মা","হারামজাদা","চোদনা","চোদানি",
  "ভোদাই","বিচি","লুচ্চা","কুত্তার নাতি","খানকি","মাগি","চুদানির পোলা","গুদ","গুদামারা",
  "সালা","হারামি","গাধা","পাগল","বেয়াদব","চুতমারানি","নটির ছেলে","নটি","ভাড়","অসভ্য",
  "মাগির পুত","বালের বাল","চুদির ভাই","খচ্চর","শুয়োর","কুত্তা","কুত্তি","ডাইনি","বেশ্যা",
  "পোদমারানি","বোকাচোদ","লেংটা","ধোন","ধোনের বাল","খানকিমাগি","নাপাক","শুয়োরমুো",
  "magi","magir chele","khanki","chodna","chudani","baler","khankir pola","maderchud",
  "gadha","harami","sala","fuck you","fucking hell","slut","whore","pussy","asshole",
  "son of a bitch","bastard","dick head","bollocks","crap","dumbass","shit","boltu"
];

module.exports.config = {
  name: "antigali",
  version: "75.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "Precision Gali Detector - No False Alarms",
  commandCategory: "Security",
  usages: "antigali on/off",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    if (!antiGaliStatus || !event.body) return;

    const message = event.body.toLowerCase();
    const { threadID, senderID, messageID, mentions } = event;
    const botID = api.getCurrentUserID();

    // ১. গালি শনাক্ত করার জন্য স্মার্ট চেক (Regex)
    // এটি নিশ্চিত করবে যে গালিটি একটি স্বাধীন শব্দ হিসেবে আছে, কোনো বড় শব্দের অংশ নয়।
    const isBadWord = badWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b|${word}(?=\\s|$)`, 'gi'); 
      return regex.test(message);
    });

    if (!isBadWord) return;

    // ২. বটকে মেনশন বা রিপ্লাই করে গালি দিলে তবেই কঠোর ব্যবস্থা
    const isBotMentioned = Object.keys(mentions).includes(botID);
    const isReplyToBot = event.messageReply && event.messageReply.senderID == botID;

    // যদি গালি থাকে কিন্তু বটকে উদ্দেশ্য করে না হয়, তবে সাধারণ ওয়ার্নিং দিবে না (অস্থায়ীভাবে এড়িয়ে যাবে যদি আপনি চান)
    // এখানে আমরা চেক করছি গালিটা কি সরাসরি কাউকে অ্যাটাক করে কি না
    if (!isBadWord) return;

    if (!offenseTracker[threadID]) offenseTracker[threadID] = {};
    if (!offenseTracker[threadID][senderID]) offenseTracker[threadID][senderID] = { count: 0 };

    let userData = offenseTracker[threadID][senderID];
    userData.count += 1;
    const count = userData.count;
    const userName = await Users.getNameUser(senderID) || "User";
    
    let groupName = "Unknown Group";
    try {
      const gInfo = await api.getThreadInfo(threadID);
      groupName = gInfo.threadName || "Unnamed Group";
    } catch(e) {}

    const warningFrame = (n) => (
`┏━━━━━━━ ⚡ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗔𝗟𝗘𝗥𝗧 ⚡ ━━━━━━━┓
        𝗣𝗥𝗘𝗖𝗜𝗦𝗜𝗢𝗡 𝗗𝗘𝗧𝗘𝗖𝗧𝗜𝗢𝗡
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
👤 ইউজার: ${userName}
⚠️ সতর্কতা: ${n} / 3
🚫 কারণ: অসভ্য ভাষা/গালি শনাক্ত হয়েছে।

🛑 নোটিশ: গ্রুপে অসভ্যতা নিষিদ্ধ। আপনার রেকর্ড "চাঁদের পাহাড়" সার্ভারে পাঠানো হয়েছে।
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"অসভ্যতা করলে বটের হাত থেকে নিস্তার নেই" 🔱`
    );

    const adminReport = (action) => (
`🏔️ 𝗖𝗛𝗔𝗡𝗗𝗘𝗥 𝗣𝗔𝗛𝗔𝗥 - 𝗟𝗢𝗚 🏔️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 গ্রুপ: ${groupName}
👤 ইউজার: ${userName} (${senderID})
💬 গালি: "${message}"
⚖️ একশন: ${action}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    );

    if (count === 1) {
      api.sendMessage(warningFrame(1), threadID, messageID);
      api.sendMessage(adminReport("1st Warning Issued"), ADMIN_REPORT_GROUP_ID);
    } else if (count === 2) {
      api.sendMessage(warningFrame(2), threadID, messageID);
      api.sendMessage(adminReport("2nd Warning - High Risk"), ADMIN_REPORT_GROUP_ID);
    } else if (count === 3) {
      const threadInfo = await api.getThreadInfo(threadID);
      const isTargetAdmin = threadInfo.adminIDs.some(i => i.id == senderID);
      const isBotAdmin = threadInfo.adminIDs.some(i => i.id == botID);

      if (!isBotAdmin || isTargetAdmin) {
        api.sendMessage(`🚨 ইউজার ${userName} এর অপরাধ সীমা ছাড়িয়েছে, কিন্তু অ্যাডমিন পাওয়ার না থাকায় কিক দেওয়া সম্ভব হয়নি।`, threadID);
        api.sendMessage(adminReport("Kick Failed (Permissions)"), ADMIN_REPORT_GROUP_ID);
        userData.count = 2;
        return;
      }

      await api.removeUserFromGroup(senderID, threadID);
      api.sendMessage(`🚨 অপরাধী ${userName}-কে গ্রুপ থেকে লাথি মেরে বের করা হয়েছে।`, threadID);
      api.sendMessage(adminReport("User Terminated / Kicked"), ADMIN_REPORT_GROUP_ID);
      userData.count = 0;
    }

    // গালি দেওয়া মেসেজটি ৫ সেকেন্ড পর ডিলিট করে দিবে (যদি বট অ্যাডমিন হয়)
    setTimeout(() => { api.unsendMessage(messageID).catch(() => {}); }, 5000);

  } catch (err) { console.log(err); }
};

module.exports.run = async function ({ api, event, args }) {
  if (args[0] === "on") {
    antiGaliStatus = true;
    return api.sendMessage("✅ AntiGali Precision Mode: ACTIVE", event.threadID);
  } else if (args[0] === "off") {
    antiGaliStatus = false;
    return api.sendMessage("❌ AntiGali Security: DEACTIVATED", event.threadID);
  }
  return api.sendMessage("Usage: antigali on/off", event.threadID);
};
