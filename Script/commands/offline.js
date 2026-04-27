const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
	name: "offline",
	version: "2.5.0",
	hasPermssion: 2,
	credits: "Chander Pahar x Gemini",
	description: "অফলাইন বা বিজি মোড সেট করার উন্নত সিস্টেম",
  	usages: "[কারণ]",
  	commandCategory: "Utility",
  	cooldowns: 5
};

const busyPath = path.join(__dirname, '/bot/busy.json');

// ফাইল এবং ডিরেক্টরি চেক
module.exports.onLoad = () => {
  const dir = path.dirname(busyPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(busyPath)) fs.writeFileSync(busyPath, JSON.stringify({}));
}

module.exports.handleEvent = async function({ api, event, Users }) {
    if (!fs.existsSync(busyPath)) return;
    let busyData = JSON.parse(fs.readFileSync(busyPath));
    const { senderID, threadID, messageID, mentions, body } = event;

    // ১. বস অনলাইনে ফিরলে নোটিফিকেশন
    if (senderID in busyData) {
        const info = busyData[senderID];
        delete busyData[senderID];
        fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));

        return api.sendMessage(`🏔️ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗕𝗔𝗖𝗞 𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗦𝗦\n━━━━━━━━━━━━━━━\nবস অনলাইনে ফিরে এসেছে! 🥰`, threadID, () => {
            if (info.tag.length == 0) {
                api.sendMessage("✨ বস, আপনি অফলাইনে থাকাকালীন কেউ আপনাকে ম্যানশন করেনি। পরিবেশ একদম শান্ত ছিল! 🍃", threadID);
            } else {
                let msg = "";
                info.tag.forEach((item, index) => {
                    msg += `${index + 1}. ${item}\n`;
                });
                api.sendMessage(`📑 𝗠𝗘𝗡𝗧𝗜𝗢𝗡 𝗥𝗘𝗣𝗢𝗥𝗧\n━━━━━━━━━━━━━━━\nবস, আপনি অফলাইনে থাকাকালীন যারা আপনাকে খুঁজেছিল:\n\n${msg}`, threadID);
            }
        }, messageID);
    }

    // ২. কেউ ম্যানশন দিলে অটো-রিপ্লাই
    if (!mentions || Object.keys(mentions).length == 0) return;
    
    for (const [ID, name] of Object.entries(mentions)) {
        if (ID in busyData) {
            const infoBusy = busyData[ID];
            const mentionerName = await Users.getNameUser(senderID);
            const cleanBody = body.replace(name, "").trim();
            
            // ট্যাগ লিস্টে সেভ করা
            infoBusy.tag.push(`${mentionerName}: ${cleanBody === "" ? "শুধু আপনাকে ম্যানশন করেছে" : cleanBody}`);
            busyData[ID] = infoBusy;
            fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));

            const replyMsg = `🏔️ 𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗦𝗦 𝗜𝗦 𝗢𝗙𝗙𝗟𝗜𝗡𝗘\n━━━━━━━━━━━━━━━\n${name.replace("@", "")} বস এখন অফলাইনে আছেন। 😴\n\n📝 কারণ: ${infoBusy.lido || "ব্যস্ত আছেন"}\n━━━━━━━━━━━━━━━\nআপনার মেসেজটি সেভ করা হয়েছে। বস অনলাইনে আসলে এটি দেখতে পাবেন। 🌻`;
            
            return api.sendMessage(replyMsg, threadID, messageID);
        }
    }
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    
    // শুধু নির্দিষ্ট পারমিশন হোল্ডার (বস) এটি ব্যবহার করতে পারবে
    // আপনার UID এখানে চেক হবে (credits বা permissions অনুযায়ী)
    
    let busyData = {};
    if (fs.existsSync(busyPath)) {
        busyData = JSON.parse(fs.readFileSync(busyPath));
    }

    const content = args.join(" ");
    
    if (!(senderID in busyData)) {
        busyData[senderID] = {
            lido: content || "কোনো কারণ উল্লেখ করা হয়নি",
            tag: [],
            time: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        };
        
        fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));
        
        const statusMsg = `🛡️ 𝗕𝗨𝗦𝗬 𝗠𝗢𝗗𝗘 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗\n━━━━━━━━━━━━━━━\nবেলাল বস এখন অফলাইনে যাচ্ছেন।\n${content ? `📝 কারণ: ${content}` : "কেউ অযথাই ম্যানশন দিবেন না।"}\n━━━━━━━━━━━━━━━\nলাইনের আসার পর সবার সাথে কথা হবে। 🏔️🌻`;
        
        return api.sendMessage(statusMsg, threadID, messageID);
    }
}
