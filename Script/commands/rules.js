const axios = require('axios');
const moment = require("moment-timezone");

module.exports.config = {
 name: "rules2",
 version: "3.0.0",
 hasPermssion: 0,
 credits: "Belal x Gemini",
 description: "গ্রুপের রাজকীয় রুলস ড্যাশবোর্ড - সবার থেকে আলাদা",
 commandCategory: "Information",
 usages: "rules2",
 cooldowns: 5
};

module.exports.run = async ({ api, event, Users }) => {
 const { threadID, messageID, senderID } = event;
 const name = await Users.getNameUser(senderID);
 const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
 const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
 const sig = "┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

 // ১. আনলিমিটেড ইউনিক ইমোজি পুল (প্রতিটি পয়েন্টের জন্য আলাদা)
 const icons = ["🛡️", "🚫", "⚡", "⚠️", "🚨", "🚀", "💎", "☄️", "🧬", "🧪", "⚙️", "🔋", "📡", "💻", "🎮", "👾", "🤖", "👑", "🔮", "🧿", "🩹", "🪜", "⚖️", "🔭", "🔬", "🔋", "📻", "🎙️", "🎛️", "⏱️", "⌛", "🕰️", "🪙", "💳", "📜", "📂", "📊", "📈", "📉", "📁", "📅", "📍", "🗝️", "🔨", "⚒️", "🔫", "🗡️", "🏹", "🚬", "💣", "🧨", "🩺", "🪓", "⚔️", "🔱", "⚜️"];
 const getIcon = () => icons[Math.floor(Math.random() * icons.length)];

 // ২. একদম নতুন এবং প্রিমিয়াম হ্যাকার ডিজাইন
 let rulesMsg = `╭┈────────── ${getIcon()} ──────────┈╮
   ${getIcon()} 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 ${getIcon()}
╰┈────────── ${getIcon()} ──────────┈╯

👋 আসসালামু আলাইকুম, ${name}!
${getIcon()} আমাদের গ্রুৃঁপেৃঁ আপনাকেৃঁ স্বাৃঁগৃঁতৃঁমৃঁ!
নিচেৃঁ গ্রুৃঁপেৃঁরৃঁ প্রিৃঁমিৃঁয়াৃঁমৃঁ রুৃঁলৃঁসৃঁগুৃঁলোৃঁ দেওয়াৃঁ হ’লোৃঁ:

┏━━━━ ${getIcon()}『 📜 𝗚𝗥𝗢𝗨𝗣_𝗖𝗢𝗡𝗦𝗧𝗜𝗧𝗨𝗧𝗜𝗢𝗡 』
┃
┃ ${getIcon()} 𝟬𝟭. আজেবাজে বা খারাপ কথা বলা সম্পূর্ণ নিষেধ।
┃ ${getIcon()} 𝟬𝟮. কাউকে ব্যক্তিগত আক্রমণ বা গালি দেওয়া যাবে না।
┃ ${getIcon()} 𝟬𝟯. অপ্রয়োজনীয় ট্যাগ বা মেনশন দেওয়া বন্ধ করুন।
┃ ${getIcon()} 𝟬𝟰. ইনবক্সে বিরক্ত করলে সরাসরি পার্মানেন্ট কিক।
┃ ${getIcon()} 𝟬𝟱. ১৮+ কন্টেন্ট বা অশ্লীল মিম শেয়ার করলে ব্যান।
┃ ${getIcon()} 𝟬𝟲. স্প্যামিং বা লিংক শেয়ার করলে কড়া অ্যাকশন।
┃ ${getIcon()} 𝟬𝟳. অ্যাডমিনদের সিদ্ধান্তই চূড়ান্ত বলে গণ্য হবে।
┃ ${getIcon()} 𝟬𝟴. ধর্ম বা জাতি নিয়ে কোনো কটাক্ষ সহ্য করা হবে না।
┃ ${getIcon()} 𝟬𝟵. গুজব ছড়ালে সাথে সাথে রিপোর্ট + ব্লক।
┃ ${getIcon()} 𝟭𝟬. মজা করুন, কিন্তু শালীনতা বজায় রাখুন।
┃
┗━━━━━━━━━━━━━━━━━━━━┈ ${getIcon()}

┏━━━━ ${getIcon()}『 🌐 𝗔𝗗𝗠𝗜𝗡_𝗖𝗢𝗡𝗧𝗔𝗖𝗧 』
┃ ${getIcon()} 👑 𝗢𝘄𝗻𝗲𝗿 : চাঁদের পাহাড় ✡️
┃ ${getIcon()} 🔗 𝗙𝗕    : ${myFB}
┃ ${getIcon()} 🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴
┗━━━━━━━━━━━━━━━━━━━━┈ ${getIcon()}

${sig}
${getIcon()} 𝗧𝗶𝗺𝗲: ${time} ${getIcon()}
${getIcon()} "সম্মান দিলে সম্মান পাবেন, রুলস মেনে পাশে থাকুন।"`;

 return api.sendMessage(rulesMsg, threadID, messageID);
};
 
