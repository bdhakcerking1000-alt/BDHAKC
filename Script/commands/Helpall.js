const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "helpall",
    version: "8.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "আনলিমিটেড ইমোজি ও প্রিমিয়াম ডার্ক-নিওন ডিজাইন",
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
    const sig = "┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

    const categories = {};
    for (let [name, value] of commands) {
        const cat = value.config.commandCategory || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
    }

    // ইমোজি পুল (প্রতিবার আলাদা ইমোজি ব্যবহারের জন্য)
    const icons = ["🚀", "⚡", "🛸", "🛰️", "🛸", "🔥", "💎", "☄️", "🛡️", "🧬", "🧪", "⚙️", "🔋", "📡", "💻", "🎮", "👾", "🤖", "👔", "🎒", "👒", "🎩", "🎒", "🥽", "🎒", "🧳", "🧣", "🎩", "👑", "🔮", "🧿", "🩹", "🩺", "🧪", "🧬", "🪜", "⚖️", "⚙️", "🪚", "🪛", "⛓️‍💥", "⛓️", "🔭", "🔬", "🔋", "📻", "🎙️", "🎛️", "⏱️", "⌛", "🕰️", "🪙", "💳", "📜", "📂", "📊", "📈", "📉", "📁", "📅", "📍", "🗝️", "🔨", "⚒️", "🔫", "🗡️", "🏹", "🚬", "💣", "🧨", "🩺", "🪓", "⚔️", "🔱", "⚜️"];
    
    let iconIdx = 0;
    const getIcon = () => icons[iconIdx++ % icons.length];

    let helpMsg = `╭┈─────────── ${getIcon()} ───────────┈╮
      ${getIcon()} 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 ${getIcon()}
╰┈─────────── ${getIcon()} ───────────┈╯\n\n`;

    for (const category in categories) {
        helpMsg += `┏━━━━ 『 ${category.toUpperCase()} ${getIcon()} 』\n`;
        // কমান্ড লিস্টে রেন্ডম ইউনিক ইমোজি
        const list = categories[category].sort().map(cmd => `┃ ${getIcon()} ❯ ${cmd}`).join("\n");
        helpMsg += `${list}\n┗━━━━━━━━━━━━━━━━━━━━┈ ${getIcon()}\n\n`;
    }

    helpMsg += `┈───────── ${getIcon()} 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗦 ${getIcon()} ─────────┈
  ${getIcon()} 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 : ${commands.size}
  ${getIcon()} 𝗦𝘁𝗮𝘁𝘂𝘀         : 𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗦𝗲𝗰𝘂𝗿𝗲𝗱
  ${getIcon()} 👑 𝗢𝘄𝗻𝗲𝗿        : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)
  ${getIcon()} 🔗 𝗙𝗕 𝗣𝗿𝗼𝗳𝗶𝗹𝗲    : ${myFB}

  ${sig}
  ${getIcon()} "Power is nothing without Control." ${getIcon()}`;

    const backgrounds = [
        "https://i.imgur.com/6b6DGcW.jpeg",
        "https://i.imgur.com/FQQq8WH.jpeg"
    ];
    
    const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const imgPath = path.join(cacheDir, `helpall_${Date.now()}.jpg`);

    try {
        const res = await axios.get(selectedBg, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data, "binary"));

        return api.sendMessage({ 
            body: helpMsg, 
            attachment: fs.createReadStream(imgPath) 
        }, threadID, () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }, messageID);
    } catch (e) {
        return api.sendMessage(helpMsg, threadID, messageID);
    }
};
 
