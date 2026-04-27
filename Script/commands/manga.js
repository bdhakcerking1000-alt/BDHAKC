const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "manga",
    aliases: ["man", "ani-manga", "comics"],
    version: "2.5.0",
    author: "Belal YT",
    countDown: 8,
    role: 0,
    shortDescription: { en: "AniList থেকে মাঙ্গা ইনফো খুঁজুন" },
    longDescription: { en: "Search detailed Manga information using the high-speed AniList GraphQL API." },
    category: "anime",
    guide: { en: "{pn} [manga name]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    const sig = "\n┈───╼ ┄┉❈✡️ Chander Pahar ✿⃝🪬 ╾───┈";
    const startTime = Date.now();

    if (!query) return message.reply("🔍 | বেলাল ভাই, যে মাঙ্গাটি খুঁজছেন তার নাম লিখুন।");

    // AniList GraphQL Query
    const anilistQuery = `
      query ($search: String) {
        Media(search: $search, type: MANGA) {
          title { romaji english native }
          description(asHtml: false)
          status
          chapters
          volumes
          averageScore
          popularity
          source
          genres
          siteUrl
          startDate { year month day }
          coverImage { extraLarge }
        }
      }
    `;

    const variables = { search: query };

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const res = await axios.post("https://graphql.anilist.co", {
        query: anilistQuery,
        variables: variables
      });

      const manga = res.data.data.Media;
      if (!manga) throw new Error("No data found");

      const title = manga.title.english || manga.title.romaji || manga.title.native;
      const desc = manga.description?.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "").substring(0, 350) || "No description available.";
      const date = manga.startDate.year ? `${manga.startDate.day}/${manga.startDate.month}/${manga.startDate.year}` : "Unknown";

      // প্রিমিয়াম বডি ডিজাইন
      const resultMsg = `╭━━━━━━━⊱ 📖 ⊰━━━━━━━╮\n   ✨ 𝗠𝗔𝗡𝗚𝗔 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 ✨\n╰━━━━━━━⊱ 📖 ⊰━━━━━━━╯\n\n` +
        `📘 𝗧𝗶𝘁𝗹𝗲   : ${title}\n` +
        `🎭 𝗚𝗲𝗻𝗿𝗲𝘀  : ${manga.genres.slice(0, 3).join(", ")}\n` +
        `📊 𝗦𝘁𝗮𝘁𝘂𝘀  : ${manga.status}\n` +
        `📚 𝗖𝗵𝗮𝗽𝘁𝗲𝗿 : ${manga.chapters || "N/A"}\n` +
        `📔 𝗩𝗼𝗹𝘂𝗺𝗲  : ${manga.volumes || "N/A"}\n` +
        `⭐ 𝗦𝗰𝗼𝗿𝗲   : ${manga.averageScore || "0"}/100\n` +
        `🔥 𝗣𝗼𝗽𝘂𝗹𝗮𝗿 : ${manga.popularity}\n` +
        `📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲 : ${date}\n` +
        `🌍 𝗦𝗼𝘂𝗿𝗰𝗲  : ${manga.source || "Manga"}\n\n` +
        `📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻:\n${desc}...\n\n` +
        `🔗 𝗟𝗶𝗻𝗸: ${manga.siteUrl}\n\n` +
        `📊 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n` +
        `⚡ 𝗦𝗽𝗲𝗲𝗱  : ${Date.now() - startTime}ms\n` +
        `🏔️ 𝗕𝗿𝗮𝗻𝗱  : চাঁদের পাহাড়\n` +
        `👑 𝗔𝗱𝗺𝗶𝗻  : BELAL YT${sig}`;

      const coverUrl = manga.coverImage.extraLarge;
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
      const imgPath = path.join(cacheDir, `manga_${Date.now()}.jpg`);

      // কভার ইমেজ ডাউনলোড
      const imgRes = await axios.get(coverUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgRes.data));

      api.setMessageReaction("📖", messageID, () => {}, true);

      return api.sendMessage({
        body: resultMsg,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }, messageID);

    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ দুঃখিত বেলাল ভাই, মাঙ্গাটি খুঁজে পাওয়া যায়নি। নাম সঠিক আছে কি না চেক করুন।");
    }
  }
};
