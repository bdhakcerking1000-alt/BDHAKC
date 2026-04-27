const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "sala",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "বন্ধুর সাথে সালা বন্ডিং ফটো এডিট করুন",
    commandCategory: "🩵love🩵",
    usages: "[@mention/reply/UID/name]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

// ১. রিসোর্স লোডার
module.exports.onLoad = async () => {
    const cacheDir = path.join(__dirname, "cache", "canvas");
    const bgPath = path.join(cacheDir, "sala_bg.jpg");
    
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    if (!fs.existsSync(bgPath)) {
        const res = await axios.get("https://i.postimg.cc/jdp17LNv/IMG-6498.jpg", { responseType: "arraybuffer" });
        fs.writeFileSync(bgPath, Buffer.from(res.data));
    }
};

// ২. ইমেজ এডিটিং ইঞ্জিন
async function makeSalaImage(one, two) {
    const cacheDir = path.join(__dirname, "cache", "canvas");
    const bgPath = path.join(cacheDir, "sala_bg.jpg");
    const outputPath = path.join(cacheDir, `sala_${one}_${two}.png`);

    const [bg, avt1, avt2] = await Promise.all([
        jimp.read(bgPath),
        jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
        jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    ]);

    avt1.circle();
    avt2.circle();

    bg.resize(500, 300)
      .composite(avt1.resize(75, 75), 118, 108) // আপনার পজিশন
      .composite(avt2.resize(75, 75), 308, 108); // বন্ধুর পজিশন

    await bg.writeAsync(outputPath);
    return outputPath;
}

// ৩. মেইন রান ফাংশন
module.exports.run = async function ({ event, api, args, Users }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    try {
        let targetID;

        // স্মার্ট টার্গেট ডিটেকশন
        if (type === "message_reply") {
            targetID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } else if (args[0]) {
            if (!isNaN(args[0])) targetID = args[0]; // সরাসরি UID দিলে
            else {
                const nameQuery = args.join(" ").toLowerCase().replace("@", "");
                const threadInfo = await api.getThreadInfo(threadID);
                const user = threadInfo.userInfo.find(u => u.name.toLowerCase().includes(nameQuery));
                targetID = user ? user.id : null;
            }
        }

        if (!targetID) return api.sendMessage("❌ বেলাল ভাই, নেংটা কালের বন্ধুকে মেনশন দিন বা রিপ্লাই করুন! 😈", threadID, messageID);
        if (targetID === senderID) return api.sendMessage("🐸 বলদ, নিজের সাথে নিজে সালা বন্ডিং হয় না! অন্যের ওপর ট্রাই কর।", threadID, messageID);

        api.setMessageReaction("⌛", messageID, () => {}, true);

        const name1 = await Users.getNameUser(senderID);
        const name2 = await Users.getNameUser(targetID);

        const imgPath = await makeSalaImage(senderID, targetID);

        const funMsgs = [
            `তুই আমার বন্ধু না, তুই আমার চিরকালের সালা! 😏🔥`,
            `সালা বন্ধন: ${name1} ❤️ ${name2} 👬`,
            `মনে আছে বন্ধু? ছোটবেলায় কতো শয়তানি করছি! 😈`,
            `আজ থেকে তুই অফিসিয়ালি আমার সালা হয়ে গেলি। 🥴`
        ];

        api.setMessageReaction("✅", messageID, () => {}, true);

        return api.sendMessage({
            body: funMsgs[Math.floor(Math.random() * funMsgs.length)],
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath), messageID);

    } catch (e) {
        console.error(e);
        return api.sendMessage("🚨 ছবি বানাতে সমস্যা হয়েছে বেলাল ভাই! পরে চেষ্টা করুন।", threadID, messageID);
    }
};
