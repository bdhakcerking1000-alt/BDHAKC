const axios = require("axios");
const jimp = require("jimp");
const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "rizz",
    aliases: ["impress", "line"],
    version: "2.5.0",
    author: "BOTX666 🪬",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Send a rizz/pickup line with an image" },
    category: "fun",
    guide: {
      en: "{pn} @mention",
    }
  },

  onStart: async function ({ api, message, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    
    // সময় ও তারিখ সেটআপ
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
    const sig = `\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

    const mention = Object.keys(mentions);
    if (mention.length == 0) return message.reply(`⚠️ চাঁদের পাহাড়, আপনি কাকে ইমপ্রেস করতে চান তাকে মেনশন করুন!${sig}`);

    api.setMessageReaction("💖", messageID, () => {}, true);

    let one = senderID;
    let two = mention[0];
    let mentionName = mentions[two].replace('@', '').split(' ')[0];

    try {
      const pth = await createRizzImage(one, two, mentionName);
      
      api.setMessageReaction("✅", messageID, () => {}, true);

      await message.reply({
        body: `🌹 চাঁদের পাহাড়, আপনার জন্য একটি স্পেশাল লাইন!${sig}`,
        attachment: fs.createReadStream(pth)
      }, () => {
        if (fs.existsSync(pth)) fs.unlinkSync(pth);
      });
    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ ছবি তৈরি করতে সমস্যা হয়েছে।${sig}`);
    }
  }
};

async function createRizzImage(one, two, mentionName) {
  const pickupLine = await fetchPickupLine();
  const canvas = createCanvas(600, 300);
  const ctx = canvas.getContext('2d');

  // ১. ব্যাকগ্রাউন্ড লোড (Blade Runner থিম)
  const background = await loadImage("https://i.ibb.co/F0ckScv/Blade-Runner-2049-Color-Palette.jpg");
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // ২. প্রোফাইল পিকচার প্রসেসিং
  const avOne = await loadAndRoundImage(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const avTwo = await loadAndRoundImage(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

  // ৩. প্রোফাইল পিকচার পজিশনিং
  ctx.drawImage(avOne, 340, 30, 70, 70); // Sender
  ctx.drawImage(avTwo, 180, 70, 60, 60); // Target

  // ৪. টেক্সট স্টাইলিং (Pickup Line)
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = "black";
  ctx.shadowBlur = 5;
  
  // টেক্সট র‍্যাপিং (যাতে ক্যানভাসের বাইরে না যায়)
  const text = `${mentionName}, ${pickupLine}`;
  wrapText(ctx, text, 30, 240, 540, 20);

  const imagePath = path.join(__dirname, "cache", `rizz_${Date.now()}.png`);
  await fs.ensureDir(path.dirname(imagePath));
  fs.writeFileSync(imagePath, canvas.toBuffer());
  return imagePath;
}

async function loadAndRoundImage(url) {
  const img = await jimp.read(url);
  img.circle();
  const buffer = await img.getBufferAsync(jimp.MIME_PNG);
  return await loadImage(buffer);
}

async function fetchPickupLine() {
  try {
    const res = await axios.get('https://vinuxd.vercel.app/api/pickup');
    return res.data.pickup;
  } catch {
    return "Are you a magician? Because whenever I look at you, everyone else disappears.";
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
