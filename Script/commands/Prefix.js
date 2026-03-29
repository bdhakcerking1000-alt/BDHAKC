const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "আনলিমিটেড ইমোজি ও অটো-ভিডিও সহ রাজকীয় প্রিফিক্স",
  commandCategory: "Information",
  usages: "prefix",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;
  if (!body) return;

  const threadSetting = (global.data.threadData.get(parseInt(threadID)) || {});
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const dataThread = await Threads.getData(threadID);
  const groupName = dataThread.threadInfo?.threadName || "Unknown Paradise";

  // 👑 আপনার নতুন ডিটেইলস
  const adminName = "𝗕𝗘𝗟𝗔𝗟 𝗬𝗧 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)";
  const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
  const phone = "𝟬𝟭𝟵𝟭𝟯𝟮𝟰𝟲𝟱𝟱𝟰";
  const sig = "┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈";

  // আনলিমিটেড ইউনিক ইমোজি পুল
  const icons = ["🚀", "⚡", "🛸", "🛰️", "🔥", "💎", "☄️", "🛡️", "🧬", "⚙️", "🔋", "📡", "💻", "🎮", "👾", "🤖", "👑", "🔮", "🧿", "⚙️", "🔭", "🔬", "🔋", "📻", "🎙️", "⏱️", "⌛", "🕰️", "🪙", "💳", "📜", "📂", "📊", "📈", "📉", "📁", "📅", "📍", "🗝️", "🔨", "🔫", "🗡️", "🏹", "💣", "🧨", "⚔️", "🔱", "⚜️"];
  
  let iconIdx = 0;
  const getIcon = () => icons[Math.floor(Math.random() * icons.length)];

  const triggerWords = ["prefix", "mprefix", "bot prefix", "কী প্রিফিক্স", "prefx", "prfix", "বট প্রিফিক্স"];

  if (triggerWords.includes(body.toLowerCase())) {
    
    const videos = [
      "https://i.imgur.com/qUJvQud.mp4", "https://i.imgur.com/HFudaEm.mp4",
      "https://i.imgur.com/i8nxwCR.mp4", "https://i.imgur.com/zygQoCK.mp4",
      "https://i.imgur.com/qYTXUUb.mp4", "https://i.imgur.com/zqVszYj.mp4",
      "https://i.imgur.com/AmXhkTP.mp4", "https://i.imgur.com/T3yb7jy.mp4",
      "https://i.imgur.com/Bfq83Nl.mp4", "https://i.imgur.com/iWRa1uU.mp4",
      "https://i.imgur.com/YniEZIV.mp4", "https://i.imgur.com/gBrSoBB.mp4",
      "https://i.imgur.com/uetKIMp.mp4", "https://i.imgur.com/2YJexzw.mp4"
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const videoPath = path.join(cacheDir, `prefix_${Date.now()}.mp4`);

    // হ্যাকার কোয়ালিটি নিওন ডিজাইন
    const message = `╭┈────────── ${getIcon()} ──────────┈╮
   ${getIcon()} 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 ${getIcon()}
╰┈────────── ${getIcon()} ──────────┈╯

${getIcon()} 𝗣𝗿𝗲𝗳𝗶𝘅 : [ ${prefix} ]
${getIcon()} 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗧 𝗫𝟲𝟲𝟲
${getIcon()} 𝗔𝗱𝗺𝗶𝗻 : ${adminName}

┏━━━━ ${getIcon()}『 📊 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 』
┃ ${getIcon()} 𝗚𝗿𝗼𝘂𝗽 : ${groupName}
┃ ${getIcon()} 𝗧𝗜𝗗   : ${threadID}
┗━━━━━━━━━━━━━━━━━━━━┈ ${getIcon()}

┏━━━━ ${getIcon()}『 🌐 𝗢𝗪𝗡𝗘𝗥 𝗟𝗜𝗡𝗞𝗦 』
┃ ${getIcon()} 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : ${myFB}
┃ ${getIcon()} 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : ${phone}
┗━━━━━━━━━━━━━━━━━━━━┈ ${getIcon()}

${sig}
${getIcon()} 𝗦𝘆𝘀𝘁𝗲𝗺: 𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗦𝗲𝗰𝘂𝗿𝗲𝗱 ${getIcon()}`;

    try {
      const { data } = await axios.get(randomVideo, { responseType: 'arraybuffer' });
      fs.writeFileSync(videoPath, Buffer.from(data, 'utf-8'));

      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(videoPath)
      }, threadID, () => {
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      }, messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage(message, threadID, messageID);
    }
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("🤖 প্রিফিক্স জানতে 'prefix' লিখে মেসেজ দিন।", event.threadID);
};
    
