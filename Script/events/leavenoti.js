const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const moment = require("moment-timezone");

module.exports.config = {
  name: "leave",
  version: "17.0.0",
  credits: "Belal x Gemini",
  description: "স্পেশাল ডার্ক নিওন কার্ড লিভ ডিজাইন",
};

module.exports.handleEvent = async function({ api, event, Users }) {
  if (event.logMessageType !== "log:unsubscribe") return;
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;
  const leftID = event.logMessageData.leftParticipantFbId;
  
  let name = "Facebook User";
  try {
      name = global.data.userName.get(leftID) || await Users.getNameUser(leftID);
  } catch (e) { console.log(e) }

  const time = moment.tz("Asia/Dhaka").format("hh:mm A | DD/MM/YYYY");
  
  // ৪০+ প্রিমিয়াম ইমোজি
  const emojiMax = ["🔱", "💎", "🛡️", "🛸", "🌀", "🛰️", "🦾", "🧿", "💫", "🎐", "🐉", "🔥", "👑", "🌠", "🌌", "🏙️", "🏮", "🎭", "🎮", "🍾", "🥃", "✨", "🌟", "🎇", "🔮", "🧪", "⚙️", "🔋", "📡", "🛸", "🧊", "💠", "🏆", "🦾", "🎖️", "⚡", "🌈", "🎋", "🍃", "🌹"];
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // কড়া রোস্টিং মেসেজ
  const roastTxt = (event.author == leftID)
    ? `নিজে নিজেই পালালি? ${rand(emojiMax)} রাস্তা মাপ আবাল! যা ভাগ! 💩`
    : `থাকার যোগ্যতা নেই তোর! 😡 তোকে সজোরে একটা লাথি মেরে বের করে দেওয়া হলো! 👞💥`;

  const cachePath = path.join(__dirname, "cache", `leave_${leftID}.png`);
  
  try {
    if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));

    const avatarUrl = `https://graph.facebook.com/${leftID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    // প্রিমিয়াম ব্যাকগ্রাউন্ড
    const bgUrl = "https://i.ibb.co/qyfD9wD/bg3.jpg"; 
    
    const [avatarRes, bgRes] = await Promise.all([
      axios.get(avatarUrl, { responseType: "arraybuffer" }).catch(() => axios.get("https://i.imgur.com/6ve9YAs.png", { responseType: "arraybuffer" })),
      axios.get(bgUrl, { responseType: "arraybuffer" })
    ]);

    const canvas = Canvas.createCanvas(1200, 700);
    const ctx = canvas.getContext("2d");

    // ১. ব্যাকগ্রাউন্ড ড্র করা
    ctx.drawImage(await Canvas.loadImage(bgRes.data), 0, 0, 1200, 700);

    // ২. মেইন গ্লাস কার্ড ইফেক্ট
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.roundRect ? ctx.roundRect(400, 150, 750, 450, 40) : ctx.fillRect(400, 150, 750, 450);
    ctx.fill();
    
    // ৩. কার্ড বর্ডার (নিওন রেড)
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 10;
    ctx.stroke();

    // ৪. প্রোফাইল পিকচার (সার্কেল ও গ্লো)
    ctx.save();
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(250, 375, 180, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(250, 375, 170, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(await Canvas.loadImage(avatarRes.data), 80, 205, 340, 340);
    ctx.restore();

    // ৫. টেক্সট ডিজাইন
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "black";
    
    // হেডার
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("REST IN HELL", 450, 120);

    // ইনফো সেকশন
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "#00FFFF";
    ctx.fillText("━━━━━━━ 𝗨𝗦𝗘𝗥 𝗘𝗫𝗜𝗧 ━━━━━━━", 460, 250);

    ctx.font = "40px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`👤 𝗡𝗮𝗺𝗲 : ${name}`, 460, 340);
    ctx.fillText(`🆔 𝗜𝗗   : ${leftID}`, 460, 420);
    ctx.fillText(`⏰ 𝗧𝗶𝗺𝗲 : ${time}`, 460, 500);

    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`👑 𝗔𝗱𝗺𝗶𝗻 : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)`, 460, 570);

    fs.writeFileSync(cachePath, canvas.toBuffer());

    const finalMsg = `┏━━━━━━━  ${rand(emojiMax)}  ━━━━━━━┓
   ⚠️ 𝗟𝗢𝗦𝗘𝗥 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 ⚠️
┗━━━━━━━  ${rand(emojiMax)}  ━━━━━━━┛

আহারে ${name}! ${rand(emojiMax)}
${roastTxt}

👑 𝗔𝗱𝗺𝗶𝗻: 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱)
┈──╼ ┄┉❈${rand(emojiMax)}⋆⃝চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ${rand(emojiMax)}`;

    return api.sendMessage({ body: finalMsg, attachment: fs.createReadStream(cachePath) }, threadID, () => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    });

  } catch (e) {
    console.error(e);
  }
};
