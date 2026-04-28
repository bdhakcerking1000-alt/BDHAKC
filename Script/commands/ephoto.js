const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Photo360 = require("abir-photo360-apis");

module.exports = {
  config: {
    name: "ephoto",
    aliases: ["ep", "textmaker"],
    version: "1.3.0",
    author: "BOTX666 🪬",
    role: 0,
    countDown: 10,
    category: "textmaker",
    shortDescription: { en: "Generate stylish images with Ephoto360" },
    guide: {
      en: "{pn} <ID> <text>\nExample: {pn} 1 Moon\nUse: {pn} list (সবগুলো টেমপ্লেট দেখতে)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
    
    const templates = {
      "1": "Foggy glass text", "2": "Cloud text", "3": "Light glow", "4": "Glitch text",
      "5": "3D metal", "6": "Foggy rainy", "7": "Sand writing", "8": "Diamond text",
      "9": "Neon signature", "10": "Broken glass", "11": "Multicolor arrow",
      "12": "Graffiti wall", "13": "Watercolor", "14": "Night lend", "15": "Sky clouds",
      "16": "Beach sand", "17": "Dark green", "18": "Stars night", "19": "3D sand",
      "20": "Summery sand", "21": "Firework text", "22": "Leaves ligature",
      "23": "Letters on leaves", "24": "Graffiti color", "25": "Paper cut"
    };

    const urls = {
      "1": "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
      "2": "https://en.ephoto360.com/create-realistic-cloud-text-effect-606.html",
      "3": "https://en.ephoto360.com/light-glow-text-effect-369.html",
      "4": "https://en.ephoto360.com/glitch-text-effect-online-345.html",
      "5": "https://en.ephoto360.com/3d-metal-text-effect-600.html",
      "6": "https://en.ephoto360.com/foggy-rainy-text-effect-75.html",
      "7": "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",
      "8": "https://en.ephoto360.com/diamond-text-95.html",
      "9": "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",
      "10": "https://en.ephoto360.com/create-broken-glass-text-effect-online-698.html",
      "11": "https://en.ephoto360.com/create-multicolored-signature-attachment-arrow-effect-714.html",
      "12": "https://en.ephoto360.com/create-a-graffiti-text-effect-on-the-wall-online-665.html",
      "13": "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",
      "14": "https://en.ephoto360.com/creating-text-effects-night-lend-for-word-effect-147.htm",
      "15": "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",
      "16": "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",
      "17": "https://en.ephoto360.com/dark-green-typography-online-359.html",
      "18": "https://en.ephoto360.com/stars-night-online-1-85.html",
      "19": "https://en.ephoto360.com/realistic-3d-sand-text-effect-online-580.html",
      "20": "https://en.ephoto360.com/create-a-summery-sand-writing-text-effect-577.html",
      "21": "https://en.ephoto360.com/text-firework-effect-356.html",
      "22": "https://en.ephoto360.com/ligatures-effects-from-leaves-146.html",
      "23": "https://en.ephoto360.com/write-letters-on-the-leaves-248.html",
      "24": "https://en.ephoto360.com/graffiti-color-199.html",
      "25": "https://en.ephoto360.com/caper-cut-effect-184.html"
    };

    // টেমপ্লেট লিস্ট দেখার সিস্টেম
    if (args[0]?.toLowerCase() === "list") {
      let msg = "╭━━━━━━⊱✨⊰━━━━━━╮\n   𝐄𝐏𝐇𝐎𝐓𝐎 𝐓𝐄𝐌𝐏𝐋𝐀𝐓𝐄𝐒\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n";
      for (const id in templates) msg += `✦ ${id}. ${templates[id]}\n`;
      return message.reply(msg + sig);
    }

    // আর্গুমেন্ট চেক
    if (args.length < 2) {
      return message.reply(`⚠️ চাঁদের পাহাড়, টেমপ্লেট আইডি এবং নাম দিন।\n\nউদাহরণ: .ephoto 1 Moon\nলিস্ট দেখতে লিখুন: .ephoto list${sig}`);
    }

    const templateID = args[0];
    const text = args.slice(1).join(" ");

    if (!urls[templateID]) {
      return message.reply(`❌ এই আইডিতে কোনো টেমপ্লেট নেই। লিস্ট দেখতে লিখুন: .ephoto list${sig}`);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const imagePath = path.join(cacheDir, `ephoto_${Date.now()}.png`);

      const photo360 = new Photo360(urls[templateID]);
      photo360.setName(text);

      const result = await photo360.execute();
      
      // ইমেজ ডাউনলোড ও সেভ
      const response = await axios({
        url: result.imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        await message.reply({
          body: `✨ 𝐄𝐩𝐡𝐨𝐭𝐨 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝! ✨\n━━━━━━━━━━━━━━\n📝 𝐓𝐞𝐱𝐭: ${text}\n🎨 𝐒𝐭𝐲𝐥𝐞: ${templates[templateID]}${sig}`,
          attachment: fs.createReadStream(imagePath)
        }, () => {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        });
      });

      writer.on("error", (err) => { throw err; });

    } catch (err) {
      console.error("Ephoto Error:", err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ দুঃখিত, ইমেজ জেনারেট করার সময় সমস্যা হয়েছে। পরে চেষ্টা করুন।");
    }
  }
};
