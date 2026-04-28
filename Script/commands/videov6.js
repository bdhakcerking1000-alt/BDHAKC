const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");
const moment = require("moment-timezone");

const API_CONFIG_URL = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "videov6",
    aliases: ["v6", "ytv"],
    version: "6.0.0",
    author: "BOTX666 🪬",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Download YouTube videos with interactive list." },
    category: "Media",
    guide: { en: "{pn} [video name]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A");
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${bdTime}`;

    if (!query) return api.sendMessage(`❌ মামা, ভিডিওর নাম তো দিলে না!${sig}`, threadID, messageID);

    try {
      api.setMessageReaction("🔍", messageID, () => {}, true);
      const search = await yts(query);
      if (!search || !search.videos.length) throw new Error("No video.");

      const results = search.videos.slice(0, 6);
      let msg = "✨🔍 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙎𝙚𝙖𝙧𝙘𝙝 𝙍𝙚𝙨𝙪𝙡𝙩𝙨 ✨\n━━━━━━━━━━━━━━━━━━━━\n\n";
      const thumbnails = [];

      for (let i = 0; i < results.length; i++) {
        const v = results[i];
        msg += `${i + 1}. ${v.title}\n⏱️ Time: ${v.timestamp} | 👀 Views: ${v.views.toLocaleString()}\n\n`;
        
        try {
          const stream = await axios.get(v.thumbnail, { responseType: 'stream' });
          thumbnails.push(stream.data);
        } catch (e) { /* skip thumbnail if error */ }
      }

      msg += "📝 ডাউনলোড করতে ১-৬ লিখে রিপ্লাই দাও।" + sig;

      const sentInfo = await api.sendMessage({ body: msg, attachment: thumbnails }, threadID);

      global.GoatBot.onReply.set(sentInfo.messageID, {
        commandName: this.config.name,
        author: senderID,
        videos: results.map(v => ({ title: v.title, url: v.url, channel: v.author.name })),
        listID: sentInfo.messageID,
        sig
      });

    } catch (err) {
      api.sendMessage(`❌ ভিডিও খুঁজে পাওয়া যায়নি মামা!${sig}`, threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, videos, listID, sig } = Reply;
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== author) return;

    const choice = parseInt(body.trim());
    if (isNaN(choice) || choice < 1 || choice > videos.length) {
      return api.sendMessage("❌ ১ থেকে ৬ এর মধ্যে সঠিক নম্বরটি দাও!", threadID, messageID);
    }

    const selectedVideo = videos[choice - 1];
    await api.unsendMessage(listID).catch(() => {});
    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      // API কনফিগারেশন সংগ্রহ
      const configRes = await axios.get(API_CONFIG_URL);
      const apiBase = configRes.data?.nixtube;
      if (!apiBase) throw new Error("API base not found.");

      const downloadRes = await axios.get(`${apiBase}?url=${encodeURIComponent(selectedVideo.url)}&type=video`);
      const downloadUrl = downloadRes.data.downloadUrl;

      if (!downloadUrl) throw new Error("Link fetch failed.");

      const cacheDir = path.join(process.cwd(), "cache");
      await fs.ensureDir(cacheDir);
      const fileName = `v6_${Date.now()}.mp4`;
      const filePath = path.join(cacheDir, fileName);

      const videoStream = await axios.get(downloadUrl, { responseType: "arraybuffer" });
      
      // ফাইল সাইজ চেক (Messenger Limit 48MB)
      if (videoStream.data.byteLength > 48 * 1024 * 1024) {
        return api.sendMessage(`❌ ভিডিওর সাইজ অনেক বড়, পাঠানো সম্ভব নয় মামা!${sig}`, threadID, messageID);
      }

      await fs.writeFile(filePath, Buffer.from(videoStream.data));

      const responseBody = `✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋\n━━━━━━━━━━━━━━━━━━━━\n🎬 𝐓𝐢𝐭𝐥𝐞: ${selectedVideo.title}\n📺 𝐂𝐡𝐚𝐧𝐧𝐞𝐥: ${selectedVideo.channel}${sig}`;

      await api.sendMessage({
        body: responseBody,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        api.setMessageReaction("✅", messageID, () => {}, true);
      }, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`❌ ডাউনলোড করতে সমস্যা হয়েছে। পরে চেষ্টা করো।${sig}`, threadID, messageID);
    }
  }
};
