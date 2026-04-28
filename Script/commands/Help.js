const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "help",
    version: "10.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "Premium Interactive Cyber-Neon Help Dashboard",
    commandCategory: "system",
    usages: "[Command Name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const prefix = global.config.PREFIX;
    
    // রিয়েল টাইম ডাটা
    const time = moment.tz("Asia/Dhaka").format("hh:mm A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
    const sig = "┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";
    
    // প্রিমিয়াম সাইবারবোর্ড ইমেজ (প্রতিবার র্যান্ডমলি আসবে)
    const helpImages = [
        "https://i.imgur.com/vHq0L9j.jpeg",
        "https://i.imgur.com/uN2tK9Q.jpeg",
        "https://i.imgur.com/YmKByaI.jpeg"
    ];

    const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
    const cacheDir = path.join(process.cwd(), "cache");
    const cachePath = path.join(cacheDir, `help_v10_${Date.now()}.jpg`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    // ১. স্পেসিফিক কমান্ড এর জন্য সাইবার ডিটেইলস
    if (args[0] && commands.has(args[0].toLowerCase())) {
        const cmd = commands.get(args[0].toLowerCase()).config;
        const detailMsg = `💠 ━━━━『 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 』━━━━ 💠
━━━━━━━━━━━━━━━━━━━━━━━

  🚀 𝗡𝗮𝗺𝗲 : ${cmd.name.toUpperCase()}
  📁 𝗧𝘆𝗽𝗲 : ${cmd.commandCategory.toUpperCase()}
  📝 𝗜𝗻𝗳𝗼 : ${cmd.description}
  🛠️ 𝗨𝘀𝗮𝗴𝗲 : ${prefix}${cmd.name} ${cmd.usages}
  ⏳ 𝗪𝗮𝗶𝘁 : ${cmd.cooldowns} সেকেন্ড
  🔰 𝗥𝗼𝗹𝗲 : ${cmd.hasPermssion == 0 ? "সাধারণ ইউজার" : "শুধুমাত্র এডমিন"}

━━━━━━━━━━━━━━━━━━━━━━━
  👑 𝐎𝐰𝐧𝐞𝐫 : 𝐁𝐄𝐋𝐀𝐋 (𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝)
  ⏰ 𝐓𝐢𝐦𝐞 : ${time}
  ${sig}`;

        try {
            const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(cachePath, Buffer.from(res.data));
            return api.sendMessage({ body: detailMsg, attachment: fs.createReadStream(cachePath) }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);
        } catch (e) { return api.sendMessage(detailMsg, threadID, messageID); }
    }

    // ২. মেইন হেল্প মেনু (স্মার্ট লিস্ট সিস্টেম)
    const categories = {};
    for (let [name, value] of commands) {
        const cat = value.config.commandCategory || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
    }

    let helpMsg = `🌐 ━━━━『 𝐌𝐀𝐒𝐓𝐄𝐑 𝐁𝐄𝐋𝐀𝐋 𝐍𝐄𝐓𝐖𝐎𝐑𝐊 』━━━━ 🌐\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    let count = 1;
    for (const category in categories) {
        helpMsg += `┏━━━━ 『 ${count++}. ${category.toUpperCase()} 』\n`;
        helpMsg += `┃ 💠 ${categories[category].sort().join(" • ")}\n┗━━━━━━━━━━━━━━━━━━━━┈ ✨\n\n`;
    }

    helpMsg += `📊 ━━━━ 『 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐒 』 ━━━━ 📊
  
  🛰️ মোট কমান্ড  : ${commands.size} টি
  🔰 বর্তমান প্রিক্স : [ ${prefix} ]
  ⏰ বর্তমান সময়  : ${time}
  📅 বর্তমান তারিখ : ${date}

  👑 এডমিন : 𝐁𝐄𝐋𝐀𝐋
  🔗 এফবি : ${myFB}

💡 টিপস: ${prefix}help [কমান্ড নাম] বিস্তারিত জানতে।
${sig}`;

    try {
        const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(cachePath, Buffer.from(res.data));
        api.sendMessage({ 
            body: helpMsg, 
            attachment: fs.createReadStream(cachePath) 
        }, threadID, () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }, messageID);
    } catch (e) {
        api.sendMessage(helpMsg, threadID, messageID);
    }
};
    
