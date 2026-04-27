const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
  name: "uptv2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  usePrefix: true,
  description: "বটের বর্তমান অবস্থা এবং আপটাইম দেখুন",
  commandCategory: "System",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "fs-extra": "",
    "path": "",
    "os": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID, timestamp } = event;
  const cachePath = path.join(__dirname, "cache", `upt_${senderID}.png`);

  try {
    // ১. ক্যানভাস সেটআপ
    const WIDTH = 1000;
    const HEIGHT = 600;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // ২. ডাইনামিক ব্যাকগ্রাউন্ড (ইমেজ না থাকলেও কাজ করবে)
    const grd = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grd.addColorStop(0, "#0f0c29");
    grd.addColorStop(0.5, "#302b63");
    grd.addColorStop(1, "#24243e");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // ডিজাইন এলিমেন্ট (নিওন সার্কেল)
    ctx.strokeStyle = "rgba(0, 242, 255, 0.1)";
    ctx.lineWidth = 50;
    ctx.beginPath(); ctx.arc(WIDTH, 0, 200, 0, Math.PI * 2); ctx.stroke();

    // ৩. ডাটা ক্যালকুলেশন
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const ping = Date.now() - timestamp;
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const owner = "Belal Boss";

    // ৪. টেক্সট স্টাইল
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";

    // টাইটেল
    ctx.font = "bold 65px sans-serif";
    ctx.fillText("SYSTEM STATUS", 60, 100);
    
    ctx.shadowBlur = 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#00f2ff";
    ctx.beginPath(); ctx.moveTo(60, 130); ctx.lineTo(550, 130); ctx.stroke();

    // ইনফরমেশন লিস্ট
    ctx.font = "bold 40px Courier New";
    ctx.fillStyle = "#00f2ff";
    
    const startX = 80;
    const startY = 220;
    const gap = 80;

    ctx.fillText(`⏱ UPTIME : ${hours}h ${minutes}m ${seconds}s`, startX, startY);
    ctx.fillText(`📶 PING   : ${ping}ms`, startX, startY + gap);
    ctx.fillText(`🧠 RAM    : ${ram}MB / ${Math.round(totalRam)}GB`, startX, startY + gap * 2);
    ctx.fillText(`👑 OWNER  : ${owner}`, startX, startY + gap * 3);

    // ৫. প্রগ্রেস বার (CPU/RAM লোড স্টাইল)
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.roundRect(80, 520, 840, 20, 10);
    ctx.fill();
    
    ctx.fillStyle = "#00f2ff";
    ctx.roundRect(80, 520, 600, 20, 10); // র‍্যান্ডম লোড বার
    ctx.fill();

    // ৬. ইমেজ সেভ এবং সেন্ড
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(cachePath, buffer);

    return api.sendMessage({
      body: `✅ বটের সিস্টেম স্ট্যাটাস চেক করা হয়েছে, বেলাল ভাই!`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ স্ট্যাটাস ইমেজ তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};

// গোল কোণা তৈরির সাপোর্ট ফাংশন
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
