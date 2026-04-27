const fs = require("fs-extra");
const path = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "approve",
  version: "2.5.0",
  hasPermssion: 2,
  credits: "Belal x Gemini",
  description: "বট ব্যবহারের জন্য গ্রুপ অ্যাপ্রুভাল সিস্টেম (Premium UI)",
  commandCategory: "Admin",
  usages: "approve <tid> <সময়> | approve box",
  cooldowns: 2,
};

const DATA_PATH = __dirname + "/data/thuebot.json";

// তারিখ ফরম্যাট করার ফাংশন
const formatDate = (d) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

const parseDate = (str) => {
  const [dd, mm, yy] = str.split("/").map(Number);
  return new Date(yy, mm - 1, dd);
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, messageReply } = event;

  // ফোল্ডার চেক
  if (!fs.existsSync(__dirname + "/data")) fs.mkdirSync(__dirname + "/data");

  // ===== রিমুভ মোড (রিপ্লাই দিয়ে নম্বর দিলে) =====
  if (messageReply && messageReply.body && messageReply.body.includes("𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗟𝗜𝗦𝗧")) {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index)) return api.sendMessage("❌ দয়া করে সিরিয়াল নম্বরটি দিন।", threadID, messageID);

    let data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    if (index < 0 || index >= data.length) return api.sendMessage("❌ ভুল নম্বর! লিস্ট চেক করুন।", threadID, messageID);

    const removed = data.splice(index, 1)[0];
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    return api.sendMessage(`🗑️ গ্রুপটি অ্যাপ্রুভ লিস্ট থেকে সরানো হয়েছে।\nTID: ${removed.t_id}`, threadID);
  }

  // ===== লিস্ট মোড (box) =====
  if (args[0] === "box") {
    if (!fs.existsSync(DATA_PATH)) return api.sendMessage("⚠️ কোনো অ্যাপ্রুভ করা গ্রুপ নেই!", threadID);

    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    if (!data.length) return api.sendMessage("⚠️ লিস্ট এখন ফাঁকা!", threadID);

    let msg = "╭┈──────────┈╮\n   ✨ 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗟𝗜𝗦𝗧 ✨\n╰┈──────────┈╯\n";
    msg += `📊 মোট গ্রুপ: ${data.length}\n━━━━━━━━━━━━━━━\n`;

    data.forEach((g, i) => {
      const end = parseDate(g.time_end);
      const now = new Date();
      const remain = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

      msg += ` [${i + 1}] 🆔 𝗧𝗜𝗗: ${g.t_id}\n 📅 মেয়াদ: ${g.time_end}\n ⏳ বাকি: ${remain} দিন\n━━━━━━━━━━━━━━━\n`;
    });

    msg += `💡 নম্বর লিখে রিপ্লাই দিলে রিমুভ হবে।\n"Premium Bot Service by Belal"`;
    
    // আপনার দেওয়া ইমেজ লিঙ্ক থেকে ব্যানার পাঠানো
    const img = (await axios.get("https://i.imgur.com/qyewZ9R.jpeg", { responseType: 'stream' })).data;
    return api.sendMessage({ body: msg, attachment: img }, threadID);
  }

  // ===== অ্যাড মোড (approve <tid> <time>) =====
  if (args.length < 2) return api.sendMessage("⚠️ ব্যবহার: approve <TID> <সময়>\nউদা: approve 123456 30day / 2month", threadID, messageID);

  const tid = args[0];
  const period = args[1].toLowerCase();
  const match = period.match(/^(\d+)(day|month|year)$/);

  if (!match) return api.sendMessage("❌ ফরম্যাট ভুল! উদা: 7day, 1month, 1year", threadID, messageID);

  const num = parseInt(match[1]);
  const unit = match[2];
  const start = new Date();
  const end = new Date();

  if (unit === "day") end.setDate(end.getDate() + num);
  if (unit === "month") end.setMonth(end.getMonth() + num);
  if (unit === "year") end.setFullYear(end.getFullYear() + num);

  let data = [];
  if (fs.existsSync(DATA_PATH)) data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  if (data.find((e) => e.t_id === tid)) return api.sendMessage("⚠️ এই গ্রুপটি অলরেডি লিস্টে আছে!", threadID, messageID);

  data.push({
    t_id: tid,
    user: "Everyone",
    time_start: formatDate(start),
    time_end: formatDate(end),
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

  return api.sendMessage(
    `✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗!\n━━━━━━━━━━━━━━━\n🆔 𝗧𝗜𝗗: ${tid}\n📅 শুরু: ${formatDate(start)}\n📅 শেষ: ${formatDate(end)}\n🌟 স্ট্যাটাস: প্রিমিয়াম মেম্বারশিপ এক্টিভেটেড।`,
    threadID, messageID
  );
};
