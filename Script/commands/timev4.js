const moment = require("moment-timezone");
const fs = require("fs-extra");
const { createCanvas } = require("canvas");

module.exports.config = {
  name: "timev4",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "অত্যাধুনিক ভি-ফোর সাইবারপাঙ্ক সময় ও তারিখ কার্ড",
  commandCategory: "Info",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "moment-timezone": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID } = event;
  const nameUser = await Users.getNameUser(senderID);
  const timeZone = "Asia/Dhaka";
  const dateStr = moment.tz(timeZone).format("DD MMMM YYYY");
  const timeStr = moment.tz(timeZone).format("hh:mm A");
  const dayStr = moment.tz(timeZone).format("dddd");

  const WIDTH = 1000;
  const HEIGHT = 1200;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // ১. ডার্ক লাক্সারি ব্যাকগ্রাউন্ড
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ব্যাকগ্রাউন্ড ডিজাইন (নিওন গ্রিড)
  ctx.strokeStyle = "rgba(0, 242, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < WIDTH; i += 50) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, HEIGHT); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(WIDTH, i); ctx.stroke();
  }

  // ২. গোল্ডেন ও নিওন বর্ডার
  const grdBorder = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grdBorder.addColorStop(0, "#00f2ff");
  grdBorder.addColorStop(1, "#ff0077");
  ctx.strokeStyle = grdBorder;
  ctx.lineWidth = 15;
  ctx.strokeRect(30, 30, WIDTH - 60, HEIGHT - 60);

  // ৩. ইউজারের জন্য গ্রিটিং কার্ড
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(80, 80, 840, 150);
  ctx.font = "35px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.fillText(`WELCOME, ${nameUser.toUpperCase()}`, 120, 170);

  // ৪. সময় রেন্ডারিং (Time V4 Style)
  ctx.textAlign = "center";
  ctx.font = "bold 160px Courier New";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00f2ff";
  ctx.shadowBlur = 25;
  ctx.fillText(timeStr.split(' ')[0], WIDTH / 2, 450);
  
  ctx.font = "50px sans-serif";
  ctx.fillStyle = "#00f2ff";
  ctx.fillText(timeStr.split(' ')[1], WIDTH / 2 + 300, 450);
  ctx.shadowBlur = 0;

  // ৫. দিন এবং তারিখের লাক্সারি ফ্রেম
  ctx.font = "bold 70px sans-serif";
  ctx.fillStyle = "#ff0077";
  ctx.fillText(dayStr.toUpperCase(), WIDTH / 2, 550);

  ctx.font = "40px Courier New";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText(dateStr, WIDTH / 2, 620);

  // ৬. স্মার্ট ক্যালেন্ডার ইন্টারফেস
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let startX = 160;
  let startY = 750;

  ctx.font = "bold 30px sans-serif";
  days.forEach((d, i) => {
    ctx.fillStyle = (d === "FRI") ? "#ff0000" : "#00f2ff";
    ctx.fillText(d, startX + i * 110, startY);
  });

  const startOfMonth = moment.tz(timeZone).startOf("month").day();
  const daysInMonth = moment.tz(timeZone).daysInMonth();
  const today = moment.tz(timeZone).date();

  let curX = startX;
  let curY = startY + 80;
  for (let i = 0; i < startOfMonth; i++) curX += 110;

  for (let d = 1; d <= daysInMonth; d++) {
    if (d === today) {
      ctx.shadowColor = "#ff0077";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ff0077";
      ctx.beginPath();
      ctx.arc(curX, curY - 12, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "#dddddd";
    }
    ctx.font = "bold 35px sans-serif";
    ctx.fillText(d, curX, curY);

    curX += 110;
    if (curX > 850) { curX = startX; curY += 90; }
  }

  // ৭. ফুটার ব্র্যান্ডিং
  ctx.font = "bold 40px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("𝐁𝐄𝐋𝐀𝐋 𝐁𝐎𝐒𝐒 𝐕𝟒 𝐒𝐘𝐒𝐓𝐄𝐌", WIDTH / 2, HEIGHT - 100);

  // ফাইল সেভ এবং সেন্ড
  const cacheDir = __dirname + "/cache";
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const pathCache = cacheDir + `/timev4_${senderID}.png`;
  
  fs.writeFileSync(pathCache, canvas.toBuffer("image/png"));

  return api.sendMessage({
    body: `✅ 𝐓𝐢𝐦𝐞 𝐕𝟒 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝!\n━━━━━━━━━━━━━\n👤 User: ${nameUser}\n⌚ Time: ${timeStr}\n📅 Date: ${dateStr}`,
    attachment: fs.createReadStream(pathCache)
  }, threadID, () => fs.unlinkSync(pathCache), messageID);
};
    
