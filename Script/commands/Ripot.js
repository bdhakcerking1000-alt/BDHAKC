const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports.config = {
  name: "ripot",
  version: "300.0.0",
  hasPermssion: 0,
  credits: "Chander Pahar",
  description: "৪০ অটো-রিপোর্ট, ডিভাইস লক থ্রেট ও ৫ সেকেন্ড ফাস্ট অ্যানিমেশন",
  commandCategory: "Security",
  usages: "[reply/mention/uid]",
  cooldowns: 0
};

if (!global.reportTracker) global.reportTracker = {};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, messageReply, mentions, senderID } = event;
  const sig = "—͟͞͞ 🏔️ 𝗖𝗵𝗮𝗻𝗱𝗲𝗿 𝗣𝗮𝗵𝗮𝗿 𝗗𝗔𝗥𝗞-𝗡𝗘𝗧 🛰️";
  
  // ১. মেগা অ্যাডমিন লক (শুধুমাত্র আপনি এবং আপনার পার্টনার)
  const allowedIDs = ["61577502464880", "100056725134303"];
  if (!allowedIDs.includes(senderID)) {
    return api.sendMessage("🛑 𝗦𝘆𝘀𝘁𝗲𝗺 𝗟𝗼𝗰𝗸𝗲𝗱! Access Denied.", threadID, messageID);
  }

  let victimID;
  if (messageReply) victimID = messageReply.senderID;
  else if (Object.keys(mentions).length > 0) victimID = Object.keys(mentions)[0];
  else if (args[0] && !isNaN(args[0])) victimID = args[0];

  if (!victimID) return api.sendMessage("🧪 টার্গেট আইডি নির্ধারণ করুন!", threadID, messageID);

  const victimName = await Users.getNameUser(victimID);
  const threadInfo = await api.getThreadInfo(threadID);
  const groupName = (threadInfo.threadName || "Security Sector").slice(0, 15);
  const groupIcon = threadInfo.imageSrc || "https://i.imgur.com/6e69688.png";

  if (!global.reportTracker[victimID]) global.reportTracker[victimID] = 0;
  global.reportTracker[victimID]++;
  const currentStrike = global.reportTracker[victimID];

  try {
    // ২. কার্ড ডিজাইনে সর্বোচ্চ সৌন্দর্য ও ডিটেইলস
    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage("https://i.imgur.com/DBaenNP.jpeg");
    ctx.drawImage(bg, 0, 0, 1000, 500);

    // নিওন গ্রিন বর্ডার (হ্যাকার স্টাইল)
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 15;
    ctx.strokeRect(0, 0, 1000, 500);

    // প্রোফাইল পিকচার (রাউন্ড নকশা)
    const avatar = await loadImage(`https://graph.facebook.com/${victimID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    ctx.save(); ctx.beginPath(); ctx.arc(200, 250, 120, 0, Math.PI * 2, true); ctx.clip();
    ctx.drawImage(avatar, 80, 130, 240, 240); ctx.restore();

    // গ্রুপের লোগো
    const gLogo = await loadImage(groupIcon).catch(() => loadImage("https://i.imgur.com/6e69688.png"));
    ctx.drawImage(gLogo, 880, 20, 100, 100);

    // কার্ডের ভেতরের সব ডিটেইলস (বেশি আপডেট)
    ctx.textAlign = "left";
    ctx.fillStyle = "#00FF00"; ctx.font = "bold 24px Courier New";
    ctx.fillText("» INTRUSION_LOG: DEVICE_ENCRYPTED", 350, 90);
    
    ctx.fillStyle = "#FF0000"; ctx.font = "bold 55px Arial";
    ctx.fillText(victimName.toUpperCase(), 350, 160);
    
    ctx.fillStyle = "#FFFFFF"; ctx.font = "20px Courier New";
    ctx.fillText(`TARGET_UID: ${victimID}`, 350, 210);
    ctx.fillText(`IP_TRACE: 103.14.XXX.${Math.floor(Math.random()*255)}`, 350, 240);
    ctx.fillText(`UNIT: ${groupName}`, 350, 270);
    ctx.fillText(`REPORTS: 40 AUTO-SUBMITTED`, 350, 300);
    ctx.fillText(`STATUS: BLACKLISTED BY DARK-NET`, 350, 330);
    
    ctx.fillStyle = "#00FFFF"; ctx.font = "bold 28px Courier New";
    ctx.fillText(`STRIKE_LEVEL: ${currentStrike}/3 (CRITICAL)`, 350, 400);

    const path = __dirname + `/cache/strike_v3_${victimID}.png`;
    fs.writeFileSync(path, canvas.toBuffer());

    // ৩. ৫ সেকেন্ডে ৫বার অ্যানিমেশন ও নকশা
    const getFrame = (p, bar, status) => 
      `┏━━━━━━━ ⚡ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗧𝗥𝗨𝗦𝗜𝗢𝗡 ⚡ ━━━━━━━┓\n` +
      `👤 𝗨𝘀𝗲𝗿 : ${victimName}\n` +
      `⚙️ 𝗔𝘁𝘁𝗮𝗰𝗸 : ${status}\n` +
      `📡 𝗣𝗼𝘄𝗲𝗿 : ৪০ High-Speed Auto Reports\n` +
      `🛰️ 𝗗𝗲𝘃𝗶𝗰𝗲 : [ ${victimID} ] Locked\n` +
      `🔓 𝗣𝗼𝗿𝘁𝘀 : Exploited (Dark-Web Bypass)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `[ ${bar} ] ${p}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📢 ডার্ক-ওয়েবে আপনার ডিভাইস লক করা হয়েছে। বেশি বাড়াবাড়ি করলে আর কোনদিন মেসেঞ্জার চালাতে পারবেন না।\n\n` +
      `${sig}`;

    const steps = [
      { p: "২০%", b: "▓▓░░░░░░░░", s: "Injecting_Reports" },
      { p: "৪০%", b: "▓▓▓▓░░░░░░", s: "Tracing_Hardware" },
      { p: "৬০%", b: "▓▓▓▓▓▓░░░░", s: "Syncing_Database" },
      { p: "৮০%", b: "▓▓▓▓▓▓▓▓░░", s: "Locking_Device" },
      { p: "১০০%", b: "▓▓▓▓▓▓▓▓▓▓", s: "SUCCESSFUL" }
    ];

    return api.sendMessage({ body: `📡 𝗜𝗻𝗶𝘁𝗶𝗮𝘁𝗶𝗻𝗴 𝟰𝟬 𝗔𝘂𝘁𝗼-𝗥𝗲𝗽𝗼𝗿𝘁𝘀...`, attachment: fs.createReadStream(path) }, threadID, () => {
      api.sendMessage(getFrame("০%", "░░░░░░░░░░", "Initial"), threadID, async (err, msgInfo) => {
        let count = 0;
        const interval = setInterval(async () => {
          if (count >= 5) {
            clearInterval(interval);
            fs.unlinkSync(path);
            
            let finalMsg = currentStrike >= 3 ? 
              `💀 𝗗𝗘𝗩𝗜𝗖𝗘 𝗕𝗟𝗔𝗖𝗞𝗟𝗜𝗦𝗧𝗘𝗗 💀\n━━━━━━━━━━━━━━━━━━━━━━\n৩টি স্ট্রাইক সফল! ৪০টি অটো-রিপোর্ট সাবমিট হয়েছে। আপনার ডিভাইস আইডি ডার্ক-ওয়েবে লক করা হয়েছে। অসভ্যতমি করলে আপনার ফোনে আর মেসেঞ্জার খুলবে না। 📵` : 
              `🩸 𝗦𝗧𝗥𝗜𝗞𝗘 ${currentStrike} 𝗗𝗘𝗣𝗟𝗢𝗬𝗘𝗗 🩸\n━━━━━━━━━━━━━━━━━━━━━━\nআইডির বিরুদ্ধে ৪০টি শক্তিশালী রিপোর্ট পাঠানো হয়েছে। আর ${3-currentStrike} বার গালি দিলে আপনার ফোন থেকে ফেসবুক এক্সেস চিরতরে হারাবেন।`;

            api.editMessage(finalMsg + `\n\n${sig}`, msgInfo.messageID);
            setTimeout(() => api.unsendMessage(msgInfo.messageID), 5000); 
            return;
          }
          api.editMessage(getFrame(steps[count].p, steps[count].b, steps[count].s), msgInfo.messageID).catch(() => {});
          count++;
        }, 1000); // ১ সেকেন্ড পর পর ৫ বার = ঠিক ৫ সেকেন্ড
      });
    });

  } catch (e) { 
    api.sendMessage("❌ Cyber-Connection Crash!", threadID); 
  }
};
