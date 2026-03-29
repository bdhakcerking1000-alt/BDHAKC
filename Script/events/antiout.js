module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "7.0.0",
  credits: "Belal x Gemini",
  description: "চাঁদের পাহাড়ের অনুমতি ছাড়া পালানো অসম্ভব - Elite Mafia Edition"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  
  // ১. এন্টি-আউট অ্যাক্টিভেশন চেক
  if (data.antiout == false) return;
  
  // ২. বট নিজে লিভ নিলে ইগনোর
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const leftID = event.logMessageData.leftParticipantFbId;
  const name = await Users.getNameUser(leftID);
  
  // 👑 আপনার নতুন ওনার ডিটেইলস (নতুন আইডি ও লিঙ্ক)
  const ownerID = "61577502464880"; 
  const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
  const sig = "\n┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

  // ৩. ফিউচারিস্টিক বর্ডার ডিজাইন
  const head = "╭┈──────────── ⛓️ ────────────┈╮";
  const line = "║───────────────────────────║";
  const foot = "╰┈──────────── 🔒 ────────────┈╯";

  // ৪. ইউজার নিজে লিভ নিলে (Self-Escape attempt)
  if (event.author == leftID) {
    api.addUserToGroup(leftID, event.threadID, async (error) => {
      
      if (error) {
        // ❌ এড করতে ব্যর্থ হলে (যদি ইউজার বটকে ব্লক করে রাখে)
        const failMsg = `${head}
      🔥 𝗘𝗦𝗖𝗔𝗣𝗘 𝗗𝗘𝗡𝗜𝗘𝗗 🔥
${foot}

  কিরে [ ${name} ]! 
  পালানোর অনেক শখ তাই না? 😂 
  ঘাড় ধরে জেলের ভেতর আনতাম, কিন্তু তুই হয়তো ভয়ে 
  বটকে ব্লক করছস নাইলে আইডি লক করে রাখছস।

  ⚠️ মনে রাখিস—চাঁদের পাহাড় এর পারমিশন ছাড়া 
  এখান থেকে বের হওয়া ইবলিশের পক্ষেও অসম্ভব! 🐸
${sig}`;
        
        api.sendMessage(failMsg, event.threadID);
        
        // 🚀 ওনারকে সিকিউরিটি এলার্ট রিপোর্ট
        const alertReport = `╭┈─────── 🔔 𝗥𝗢𝗬𝗔𝗟 𝗔𝗟𝗘𝗥𝗧 ───────┈╮
       𝗦𝘆𝘀𝘁𝗲𝗺 𝗕𝗿𝗲𝗮𝗰𝗵 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!
╰┈────────────────────────────┈╯

🏰 𝗚𝗿𝗼𝘂𝗽 : ${(await api.getThreadInfo(event.threadID)).threadName}
👤 𝗠𝗲𝗺𝗯𝗲𝗿: ${name}
🆔 𝗨𝗜𝗗   : ${leftID}
❌ 𝗦𝘁𝗮𝘁𝘂𝘀 : পালানোর চেষ্টা করেছে (বট ব্লকড)

┈─────── 💠 𝗢𝘄𝗻𝗲𝗿 𝗜𝗻𝗳𝗼 ───────┈
👑 Admin : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)
🌐 FB ID : ${myFB}
${sig}`;
        api.sendMessage(alertReport, ownerID);

      } else {
        // ✅ সফলভাবে ফিরিয়ে আনলে (মাফিয়া রি-অ্যাড)
        const successMsg = `${head}
      🦅 𝗠𝗔𝗙𝗜𝗔 𝗥𝗘-𝗔𝗗𝗗 🦅
${foot}

  শোন বে [ ${name} ]! 
  এইটা কি তোর মামার বাড়ির আবদার যে ইচ্ছামতো আসবি আর যাবি? 😂 
  এই গ্রুপে ঢুকতে যেমন কলিজা লাগে, বের হতেও তেমনি 
  "চাঁদের পাহাড়" এর পারমিশন লাগে! 

  অনুমতি ছাড়া পালানোর চেষ্টা করার জন্য তোকে আবার 
  কলার ধরে টেনে নিয়ে আসলাম। এখন চুপচাপ কোণায় বসে থাক! 👞💥
${sig}`;
        
        api.sendMessage(successMsg, event.threadID);
        
        // 🚀 ওনারকে সাকসেস রিপোর্ট
        const successReport = `╭┈─────── 🔔 𝗥𝗢𝗬𝗔𝗟 𝗔𝗟𝗘𝗥𝗧 ───────┈╮
       𝗨𝘀𝗲𝗿 𝗥𝗲-𝗖𝗮𝗽𝘁𝘂𝗿𝗲𝗱! ✅
╰┈────────────────────────────┈╯

🏰 𝗚𝗿𝗼𝘂𝗽 : ${(await api.getThreadInfo(event.threadID)).threadName}
👤 𝗠𝗲𝗺𝗯𝗲𝗿: ${name}
🆔 𝗨𝗜𝗗   : ${leftID}
✅ 𝗦𝘁𝗮𝘁𝘂𝘀 : ঘাড় ধরে ফিরিয়ে আনা হয়েছে।

┈─────── 💠 𝗢𝘄𝗻𝗲𝗿 𝗜𝗻𝗳𝗼 ───────┈
👑 Admin : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)
🌐 FB ID : ${myFB}
${sig}`;
        api.sendMessage(successReport, ownerID);
      }
    });
  }
};
