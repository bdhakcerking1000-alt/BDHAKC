module.exports.config = {
  name: "otherbots",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "Chander Pahar x Gemini",
  description: "Advanced Bot Detection & Protection System",
  commandCategory: "config",
  cooldowns: 0
};

module.exports.handleEvent = async function({ event, api, Users }) {
  const { threadID, messageID, body, senderID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");
  
  // ১. নিজের বট এবং ইতিমধ্যে ব্যান হওয়া ইউজার চেক
  if (senderID == api.getCurrentUserID()) return;
  if (global.data.userBanned && global.data.userBanned.has(senderID)) return;
  
  const userName = await Users.getNameUser(senderID);
  
  // ২. আপনার দেওয়া অরিজিনাল লিস্ট (একটিও বাদ দেওয়া হয়নি) + নতুন কিছু অ্যাডভান্স কীওয়ার্ড
  const botKeywords = [
    "your keyboard level has reached level", "Command not found", "The command you used",
    "Uy may lumipad", "Unsend this message", "You are unable to use bot",
    "»» NOTICE «« Update user nicknames", "just removed 1 Attachments", "message removedcontent",
    "The current preset is", "Here Is My Prefix", "just removed 1 attachment.",
    "Unable to re-add members", "removed 1 message content:", "Here's your music, enjoy!🥰",
    "Ye Raha Aapka Music, enjoy!🥰", "your keyboard Power level Up", "your keyboard hero level has reached level",
    "Error: Cannot read properties of undefined", "Error in onChat: Request failed with status code 500",
    "Error: Failed to fetch list", "⚠️ একটি ত্রুটি ঘটেছে, দয়া করে পরে আবার চেষ্টা করুন।",
    "😲🧸👀", "😲🧸😼", "😲🧸😚", "😲🧸🥴", "😲🧸🐸", "What's up?",
    "❌ Please provide a question or prompt.", "Hi there! How can I help you today?",
    "Hello! How can I help you today?", "Wait koro baby 😽", "Generation failed!",
    "Error: Request failed with status code 404", "Request failed with status code 500.",
    "An error", "❌ Error", "❌ Please provide an image URL", "😤😤😎", "😤😤🚶",
    "𝗬𝗼𝘂🥳🥳", "𝗝𝗮𝗻𝗶𝗻𝗮🐐", "𝗛𝗶𝗵𝗶😀", "😒😒 😘", "𝗼𝗸𝘆 𝗯𝗯𝘆😆", "𝗼𝗸𝘆 𝗯𝗯𝘆🐥",
    "𝐭𝐮𝐦𝐢 𝐩𝐨𝐜𝐚 🥰", "𝗽𝗿𝗲 𝗶𝘀 𝗮 𝗽𝗿𝗲𝗳𝗶𝘅", "𝗡𝗼 𝗻𝗼😦", "𝗩𝗮𝗹𝗼 𝘁𝘂𝗺𝗶😆", "রাতে বিছানায় হিসু করে",
    "𝗡𝗼𝗽𝗲𝗲🫡", "Yes 😀, I am here", "𝗔𝗺𝗶 𝗮𝗿 𝘁𝘂𝗺𝗶😟", "𝗔𝗹𝗹𝗮𝗵 𝗛𝗮𝗳𝗲𝗲𝘇😡", "𝗮𝗺𝗻𝗶😴😴",
    "এমনিই👋", "𝘆𝗼𝘂 𝘁𝗼𝗼😼", "𝗸𝗶 𝗯𝗼𝗹𝗯𝗲 𝗯𝗼𝗹𝗼🤒", "𝗸𝗮𝗿 𝗷𝗼𝗻𝗻𝗼 𝗮𝘁𝗼 𝗹𝗼𝘃𝗲🦆", "𝘁𝗼𝗿 𝗸𝗮𝘀𝗲𝗶 𝗿𝗮𝗸🐥",
    "তাহলে মায়াবতী কে আমাকে দাও", "𝗛𝗺𝗺 𝗰𝗵𝗼𝗹 𝗹𝗮𝗺 𝘁𝗼😘", "𝗰𝗵𝗶𝗽𝗮𝗶😗", "আমার কোনো পছন্দ নেই🌝",
    "আগে ভালোবাসি বলো", "𝗛𝘂𝗵🙂", "𝘀𝗲𝗻𝘁𝗶 𝗻𝗮 𝗸𝗵𝗮𝘆𝗲", "𝗢𝗸𝗮𝘆👋👋", "𝗧𝗵𝗶𝗸 𝗮𝗰𝗵𝗲🌝", "𝗔𝘆😾",
    "𝗲𝗳𝗴𝗵🤷", "𝗡𝗮😃", "𝗶 𝗹𝗮𝗽 𝘂 𝗯𝗯𝘆🐐", "𝗛𝗺𝗺🫰", "𝘁𝘂𝗶 𝘁𝗼 vloi sytn 😡", "وَعَلَيْكُمُ السَّلَامُ",
    "🔍 Platform detected: TikTok", "বেশি Bot Bot করলে leave নিবো কিন্তু😒",
    "⚠️ Sorry Boss এই আবালকে অ্যাড করলাম না", "এত হাই-হ্যালো কর ক্যান প্রিও", "আলহামদুলিল্লাহ😏",
    "🤖 𝙷𝚞𝚑! 𝚃𝚑𝚊𝚝 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚍𝚘𝚎𝚜𝚗'𝚝 𝚎𝚡𝚒𝚜𝚝", "🤖 𝗖ᴏᴍᴍᴀɴᴅ ɴᴏᴛ ғᴏᴜɴᴅ",
    "⚠️ দুঃখিত, আমি ইউজারটাকে আবার অ্যাড করতে পারিনি", "Hey senpai!", "তুমার দুধে উম্মাহ 🥺🤌",
    "আলাবু বলো সোনা 🤧", "😁🫵", "হ্যাঁ গো জান বলো 🙂", "Error api Response ❌",
    "ℹ️ [!] ɪғ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ɴᴏᴛ", "𝗛𝗺𝗺🐥", "𝗘𝗺𝗻𝗶𝗲😛", "𝗛𝗼𝗼𝗼𝗼𝗼𝗼𝗼𝗼𝗼⛹️", "😑🦧👽",
    "হাঁসতে ছে নাকি আমার কষ্ট দেখে", "𝗩𝗹𝗼🩵🩵", "🤦🤷‍♀️😵‍💫", "কি দিবো🌚", "𝗢𝗸𝗸 𝗯𝗯𝘂🧑‍🍼",
    "𝗣𝗿𝗲𝗴𝗻𝗮𝗻𝘁👋", "𝗕𝗮𝗻𝗱𝗼𝗿 𝗵𝗼𝗶𝗹𝗻 𝗻𝗮𝗸𝗶😡", "𝗢𝗸😏", "𝗞𝗻😴😴", "𝗵𝗶𝗵𝗶😏",
    "শুনবো না😼তুমি আমার", "আমি আবাল দের সাথে কথা বলি না", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
    "Bolo Babu, তুমি কি আমাকে ভালোবাসো", "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
    "হ্যা বলো😒, তোমার জন্য কি করতে পারি", "এতো ডাকছিস কেন?গালি শুনবি নাকি", "I love you janu🥰",
    "আরে Bolo আমার জান", "অসম্মান করছিস😰😿", "Hop beda😾 Boss বল boss😼",
    "চুপ থাক নাই তো তোর দাত ভেগে দিবো কিন্তু", "আরেকবার বট বললে ওইটা কেটে ছোট বানিয়ে দিবো",
    "বট বলে চলে যাস কেন😤🥺কী হলো উওর দে🥺", "জানু বল জানু 😘", "বার বার Disturb করছিস কোনো😾",
    "বোকাচোদা এতো ডাকিস কেন🤬", "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘",
    "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒", "চিপায় আছি ডিস্টার্ব করিস না🙊🙁",
    "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস",
    "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো", "আমাকে ডেকো না,আমি ব্যাস্ত আছি",
    "কি হলো , মিস্টেক করচ্ছিস নাকি🤣", "বলো কি বলবা, সবার সামনে বলবা নাকি", "কালকে দেখা করিস তো একটু 😈",
    "হা বলো, শুনছি আমি 😏", "আর কত বার ডাকবি ,শুনছি তো", "হুম বলো কি বলবে😒",
    "উফ্ খেলার সময়ও ডাকা-ডাকি করে", "বলো কি করতে পারি তোমার জন্য", "আমি তো অন্ধ কিছু দেখি না🐸 😎",
    "জান তোমার ওই খানে উম্মাহ😑😘", "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
    "আমাকে এতো ডাকো কেন?🤔 ভলো-টালো বাসো নাকি🤭🙈", "🌻🌺💚আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
    "জান🥺 তুমি এখন শুধু বট বলে চলে যাও 😒 ভুলে গেলা নাকি🙂❓", "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
    "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না", "আমি তোমাকে রাতে রাতে ভালোবাসি উম্মম্মাহ",
    "জান হাঙ্গা করবা-🙊😝🌻", "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি",
    "জান বাল ফালাইবা-🙂🥱🙆‍♂", "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা", "তাকাই আছো কেন চুমু দিবা",
    "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু", "আমার গল্পে তোমার নানি সেরা", "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর",
    "চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে", "যেই আইডির মায়ায় পড়ে ভুল্লি আমারে"
  ];

  const isBotMessage = botKeywords.some(keyword => body && body.includes(keyword));

  if (isBotMessage) {
    const userData = await Users.getData(senderID);
    
    // ৩. মেমোরি এবং ডাটাবেজ আপডেট
    if (!global.data.userBanned) global.data.userBanned = new Map();
    global.data.userBanned.set(senderID, { reason: "Auto-detected Bot", dateAdded: time });

    userData.banned = 1;
    userData.reason = "Auto-detected Bot";
    userData.dateAdded = time;
    await Users.setData(senderID, { data: userData });

    // ৪. নতুন অ্যাডভান্স সিকিউরিটি নোটিশ (গ্রুপের জন্য)
    const noticeBody = `🚫 𝗕𝗢𝗧 𝗜𝗡𝗧𝗥𝗨𝗦𝗜𝗢𝗡 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 🚫\n━━━━━━━━━━━━━━━\n👤 ইউজার: ${userName}\n🆔 আইডি: ${senderID}\n🛡️ একশন: কিক এবং পার্মানেন্ট ব্যান\n⏰ সময়: ${time}\n━━━━━━━━━━━━━━━\n"চাঁদের পাহাড়ে অন্য কোনো বটের প্রবেশ নিষেধ। সিস্টেম অটোমেটিক একে পরিষ্কার করেছে।" 🏔️🚮`;

    api.sendMessage(noticeBody, threadID, async () => {
      // ৫. অটো-কিক ফিচার (নতুন)
      try {
        await api.removeUserFromGroup(senderID, threadID);
      } catch (e) {
        console.log("Kick failed: Admin permission required.");
      }

      // ৬. অ্যাডমিনদের ইনবক্সে বিশেষ রিপোর্ট পাঠানো (নতুন)
      if (global.config.ADMINBOT && Array.isArray(global.config.ADMINBOT)) {
        const adminMsg = `⚠️ [ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗔𝗟𝗘𝗥𝗧 ] ⚠️\n\nগ্রুপ আইডি: ${threadID}\nঅপরাধী: ${userName}\nইউজার আইডি: ${senderID}\nডিটেকশন টাইম: ${time}\n\nসিস্টেম অটোমেটিক এই বটটিকে ব্যান এবং কিক করেছে।`;
        for (const adminID of global.config.ADMINBOT) {
          api.sendMessage(adminMsg, adminID);
        }
      }
    }, messageID);
  }
};

module.exports.run = async function({ event, api }) {
  api.sendMessage("🛡️ Otherbots Premium Guard সক্রিয় আছে। এটি স্বয়ংক্রিয়ভাবে স্প্যাম বট ডিটেক্ট করে আপনার গ্রুপ সুরক্ষিত রাখবে।", event.threadID);
};
