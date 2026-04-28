const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "help",
    version: "11.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "Premium Cinema-Style Interactive Dashboard",
    commandCategory: "system",
    usages: "[Command Name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const prefix = global.config.PREFIX;
    
    const time = moment.tz("Asia/Dhaka").format("hh:mm A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
    const sig = "┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";
    
    // হাই-ডেফিনিশন সাইবার এনিমেশন ইমেজ
    const helpImages = [
        "https://i.imgur.com/uN2tK9Q.jpeg",
        "https://i.imgur.com/vHq0L9j.jpeg",
        "https://i.imgur.com/YmKByaI.jpeg",
        "https://i.imgur.com/6b6DGcW.jpeg"
    ];

    const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
    const cachePath = path.join(process.cwd(), "cache", `help_v11_${Date.now()}.jpg`);

    if (!fs.existsSync(path.join(process.cwd(), "cache"))) fs.mkdirSync(path.join(process.cwd(), "cache"), { recursive: true });

    // ১. স্পেসিফিক কমান্ড ডিটেইলস (Ultra Premium Look)
    if (args[0] && commands.has(args[0].toLowerCase())) {
        const cmd = commands.get(args[0].toLowerCase()).config;
        const detailMsg = `🔰 ━━━━『 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 』━━━━ 🔰
━━━━━━━━━━━━━━━━━━━━━━━

  🚀 𝗡𝗮𝗺𝗲 : ${cmd.name.toUpperCase()}
  📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${cmd.commandCategory.toUpperCase()}
  📝 𝗜𝗻𝗳𝗼 : ${cmd.description}
  🛠️ 𝗨𝘀𝗮𝗴𝗲 : ${prefix}${cmd.name} ${cmd.usages}
  ⏳ 𝗪𝗮𝗶𝘁 : ${cmd.cooldowns} সেকেন্ড
  👤 𝗥𝗼𝗹𝗲 : ${cmd.hasPermssion == 0 ? "Everyone" : "Admin Only"}

━━━━━━━━━━━━━━━━━━━━━━━
  👑 𝐎𝐰𝐧𝐞𝐫 : 𝐁𝐄𝐋𝐀𝐋 (𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝)
  ⏰ 𝐓𝐢𝐦𝐞 : ${time}
  ${sig}`;

        try {
            const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(cachePath, Buffer.from(res.data));
            return api.sendMessage({ body: detailMsg, attachment: fs.createReadStream(cachePath) }, threadID, () => fs.unlinkSync(cachePath), messageID);
        } catch (e) { return api.sendMessage(detailMsg, threadID, messageID); }
    }

    // ২. মেইন হেল্প মেনু (প্রতিটি কমান্ড আলাদা বক্সে - Cinema Layout)
    const categories = {};
    for (let [name, value] of commands) {
        const cat = value.config.commandCategory || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
    }

    const icons = ["⚡", "🛰️", "🛸", "💎", "🔥", "☄️", "🛡️", "🧬", "⚙️", "🔋", "📡", "👾", "🤖", "👑", "🔮", "🧿", "⚔️", "🔱"];
    const getIcon = () => icons[Math.floor(Math.random() * icons.length)];

    let helpMsg = `🎬 ━━━━『 𝐁𝐄𝐋𝐀𝐋 𝐂𝐈𝐍𝐄𝐌𝐀 𝐁𝐎𝐀𝐑𝐃 』━━━━ 🎬\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (const category in categories) {
        const catIcon = getIcon();
        helpMsg += `┏━━━━━━『 ${catIcon} ${category.toUpperCase()} ${catIcon} 』\n`;
        
        // প্রতিটি কমান্ড আলাদা আলাদা বক্সে সাজানো হচ্ছে
        const sortedCmds = categories[category].sort();
        sortedCmds.forEach(cmd => {
            helpMsg += `┃ ❯ ${getIcon()} ${cmd.padEnd(15)}\n`;
        });
        
        helpMsg += `┗━━━━━━━━━━━━━━━━━━━━┈ ✨\n\n`;
    }

    helpMsg += `📊 ━━━『 𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃 』━━━ 📊
  
  🛰️ Total Commands : ${commands.size}
  🔰 Prefix Status : [ ${prefix} ]
  ⏰ Live Time : ${time}
  📅 Date Today : ${date}

  👑 Master Admin : 𝐁𝐄𝐋𝐀𝐋 (𝐕𝐈𝐏)
  🔗 FB : ${myFB}

  ${sig}
  ✨ "Your imagination is our Reality." ✨`;

    try {
        const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(cachePath, Buffer.from(res.data));
        api.sendMessage({ 
            body: helpMsg, 
            attachment: fs.createReadStream(cachePath) 
        }, threadID, () => fs.unlinkSync(cachePath), messageID);
    } catch (e) {
        api.sendMessage(helpMsg, threadID, messageID);
    }
};
