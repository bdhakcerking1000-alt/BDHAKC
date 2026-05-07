const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "ripot",
  version: "25.0.0",
  hasPermssion: 2, 
  credits: "Chander Pahar",
  description: "ব্যানার কার্ড, ৩-স্ট্রাইক রিপোর্ট ও ১০০% মেসেজ ব্লক চূড়ান্ত অস্ত্র",
  commandCategory: "Security",
  usages: "[reply/mention/uid/link]",
  cooldowns: 0
};

if (!global.reportTracker) global.reportTracker = {};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, messageReply, mentions } = event;
  const sig = "—͟͞͞ 🏔️ 𝗖𝗵𝗮𝗻𝗱𝗲𝗿 𝗣𝗮𝗵𝗮𝗿 𝗗𝗘𝗔𝗧𝗛-𝗡𝗘𝗧 🛰️";
  const bgImgURL = "https://i.imgur.com/DBaenNP.jpeg"; // আপনার দেওয়া ছবি

  let victimID;

  // ১. ইউজার ডিটেকশন (রিপ্লাই, মেনশন, ইউআইডি বা লিঙ্ক)
  if (messageReply) {
    victimID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    victimID = Object.keys(mentions)[0];
  } else if (args[0]) {
    if (!isNaN(args[0])) victimID = args[0];
    else if (args[0].includes("facebook.com")) {
      const res = await axios.get(`https://api.realspeaker.com/fb-id?url=${args[0]}`); // লিঙ্ক থেকে আইডি করার এপিআই (যদি আপনার থাকে)
      victimID = res.data.id;
    }
  }

  if (!victimID) return api.sendMessage("🩸 কাকে শেষ করবেন? তার মেসেজে রিপ্লাই দিন বা মেনশন করুন!", threadID, messageID);

  const victimName = await Users.getNameUser(victimID);
  if (!global.reportTracker[victimID]) global.reportTracker[victimID] = 0;
  global.reportTracker[victimID]++;
  const currentStrike = global.reportTracker[victimID];

  try {
    // ২. ক্যানভাস দিয়ে ব্যানার তৈরি
    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(bgImgURL);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const avatar = await loadImage(`https://graph.facebook.com/${victimID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    
    // ছবি গোল করে বসানো
    ctx.save();
    ctx.beginPath();
    ctx.arc(600, 250, 110, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 490, 140, 220, 220);
    ctx.restore();

    // টেক্সট ডিজাইন (ভিকটিম ডিটেইলস)
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText(victimName, 600, 430);
    ctx.font = "35px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`UID: ${victimID}`, 600, 485);
    ctx.fillText(`STRIKE: ${currentStrike}/3 | STATUS: TERMINATING`, 600, 540);

    const path = __dirname + `/cache/strike_${victimID}.png`;
    fs.writeFileSync(path, canvas.toBuffer());

    const getDarkEmoji = () => ["☢️", "🩸", "💀", "⚰️", "🔥", "💉", "👺", "🔪", "💥", "🪦"][Math.floor(Math.random() * 10)];

    const getFrame = (status, progress) => 
      `┏━━━━━━━ ${getDarkEmoji()}${getDarkEmoji()} ━━━━━━━┓\n` +
      `   🔱 𝗖𝗬𝗕𝗘𝗥 𝗘𝗫𝗘𝗖𝗨𝗧𝗜𝗢𝗡 🔱   \n` +
      `┗━━━━━━━ ${getDarkEmoji()}${getDarkEmoji()} ━━━━━━━┛\n\n` +
      `👤 𝗧𝗮𝗿𝗴𝗲𝘁: ${victimName}\n` +
      `⚙️ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀: ${status}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${progress}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📢 𝗗𝗮𝗻𝗴𝗲𝗿: বটকে গালি দেওয়ার অপরাধে আপনার আইডি ডার্ক-সার্ভারে এনক্রিপ্ট করা হয়েছে। মেটা সিকিউরিটি টিমের কাছে রিপোর্ট পাঠানো হচ্ছে।\n\n` +
      `${sig}`;

    // ৫টি অ্যানিমেশন স্টেপ (আপনার চাহিদা অনুযায়ী)
    const steps = [
      { s: "১০%", p: "🔴 ▰▱▱▱▱▱▱▱▱▱" },
      { s: "৩৫%", p: "🟠 ▰▰▰▱▱▱▱▱▱▱" },
      { s: "৬০%", p: "🟡 ▰▰▰▰▰▰▱▱▱▱" },
      { s: "৮৫%", p: "🟢 ▰▰▰▰▰▰▰▰▱▱" },
      { s: "১০০%", p: "💀 ▰▰▰▰▰▰▰▰▰▰" }
    ];

    // ৩. অপারেশন শুরু
    return api.sendMessage({ body: `☢️ 𝗗𝗔𝗥𝗞-𝗡𝗘𝗧 𝗦𝗧𝗥𝗜𝗞𝗘 𝗜𝗡𝗜𝗧𝗜𝗔𝗧𝗘𝗗 ☢️`, attachment: fs.createReadStream(path) }, threadID, () => {
      api.sendMessage(getFrame("অপারেশন শুরু...", "⚪ ▱▱▱▱▱▱▱▱▱▱"), threadID, async (err, msgInfo) => {
        let count = 0;
        const interval = setInterval(async () => {
          if (count >= 5) {
            clearInterval(interval);
            fs.unlinkSync(path);
            
            let finalMsg = "";
            if (currentStrike >= 3) {
              finalMsg = `💀 𝗜𝗗 𝗧𝗘𝗥𝗠𝗜𝗡𝗔𝗧𝗘𝗗 💀\n━━━━━━━━━━━━━━━\n৩টি স্ট্রাইক পূর্ণ! আইডিতে ১২০+ হাই-ফ্রিকোয়েন্সি রিপোর্ট পাঠানো হয়েছে। এই আইডি এখন ১০০% মেসেজ ব্লক খাবে। তোর দিন শেষ অসভ্য! 🩸`;
              global.reportTracker[victimID] = 0; // রিসেট
            } else {
              finalMsg = `🩸 𝗦𝗧𝗥𝗜𝗞𝗘 ${currentStrike} 𝗗𝗢𝗡𝗘 🩸\n━━━━━━━━━━━━━━━\nআপনার আইডি থেকে ৬০টি রিপোর্ট সরাসরি ফেসবুক হেডকোয়ার্টারে পাঠানো হয়েছে। শীঘ্রই ফলাফল দেখতে পাবেন। আর ${3-currentStrike} বার গালি দিলে আইডি হারাবেন।`;
            }

            api.editMessage(finalMsg + `\n\n${sig}`, msgInfo.messageID);
            setTimeout(() => api.unsendMessage(msgInfo.messageID), 5000); 
            return;
          }
          api.editMessage(getFrame(steps[count].s, steps[count].p), msgInfo.messageID).catch(() => {});
          count++;
        }, 1500);
      });
    });

  } catch (e) { console.log(e); api.sendMessage("❌ ব্যানার তৈরি করতে সমস্যা হয়েছে!", threadID); }
};
