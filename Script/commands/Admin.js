const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "10.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "রাজকীয় ওনার ইনফরমেশন ড্যাশবোর্ড",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY | hh:mm A");
    const myFB = "https://www.facebook.com/profile.php?id=61577502464880";
    const cachePath = __dirname + "/cache/belal_admin.png";

    const callback = () => api.sendMessage({
        body: `╭┈──────────── 💠 ────────────┈╮
      🌟 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 🌟
╰┈──────────── ⚡ ────────────┈╯

  👤 𝗡𝗮𝗺𝗲      : 𝗕𝗘𝗟𝗔𝗟 𝗬𝗧 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)
  🎭 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲  : চাঁদের পাহাড় 
  🚹 𝗚𝗲𝗻𝗱𝗲𝐫    : 𝗠𝗮𝗹𝗲 (👑)
  ❤️ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻  : 𝗦𝗶𝗻𝗴𝗹𝗲 𝗕𝘂𝘁 𝗥𝗼𝘆𝗮𝗹 💎
  🎂 𝗔𝗴𝗲       : 𝟭𝟴+ 
  🕌 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻  : 𝗜𝘀𝗹𝗮𝗺 (🕋)
  🏫 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗠𝗮𝗻 📈
  🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀  : 𝗞𝘂𝗿𝗶𝗴𝗿𝗮𝗺, 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵 🇧🇩

  ┈─────── 🌐 𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝗠𝗲 ───────┈
  🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : ${myFB}
  📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : 𝟬𝟭𝟵𝟭𝟯𝟮𝟰𝟲𝟱𝟱𝟰
  🎬 𝗧𝗶𝗸𝗧𝗼𝗸   : চাঁদের পাহাড় 
  
  🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱   : ${time}
  🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀   : 𝗢𝗻𝗹𝗶𝗻𝗲 & 𝗦𝗲𝗰𝘂𝗿𝗲𝗱
  
  ┈───╼ ┄┉❈✡️⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✿⃝🪬 ╾───┈
  💡 "যোগ্যতা অর্জনে সময় ব্যয় করুন, ভাগ্য এমনিতেই বদলে যাবে।"`,
        attachment: fs.createReadStream(cachePath)
    }, event.threadID, () => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    });

    // আপনার প্রিমিয়াম ইমেজ লিঙ্ক (এটি সরাসরি ডাউনলোড হবে)
    const imageURL = "https://drive.google.com/uc?export=download&id=1einn1yuJuZ2apADZL-lcJFHZIlrXn_bn";

    return request(encodeURI(imageURL))
        .pipe(fs.createWriteStream(cachePath))
        .on('close', () => callback());
};
