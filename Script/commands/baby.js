const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "Bot", "বট"],
    version: "7.0.0",
    author: "BELAL ⊶ BOTX666 🪬",
    countDown: 0,
    role: 0,
    description: "সবচেয়ে বুদ্ধিমান চ্যাটবট যা আপনার সাথে কথা বলবে।",
    category: "chat",
    guide: {
        en: "{pn} [কথাবার্তা]\nteach [প্রশ্ন] - [উত্তর] (নতুন কিছু শেখাতে)\nremove [প্রশ্ন] (রিমুভ করতে)\nlist (টোটাল ডাটা দেখতে)"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const query = args.join(" ").toLowerCase();
    const uid = event.senderID;
    const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

    try {
        if (!args[0]) {
            const ran = ["বলো চাঁদের পাহাড় জানু, কি বলতে চাও? 🪬", "হুম শুনতেছি, বলো.. ✨", "সবাইকে বাদ দিয়ে আমাকে ডাকলে যে? 🙈"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)] + sig, event.threadID, event.messageID);
        }

        // রিমুভ সিস্টেম
        if (args[0] === 'remove') {
            const target = query.replace("remove ", "");
            const res = (await axios.get(`${link}?remove=${encodeURIComponent(target)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✅ ${res}${sig}`, event.threadID, event.messageID);
        }

        // লিস্ট সিস্টেম
        if (args[0] === 'list') {
            const res = (await axios.get(`${link}?list=all`)).data;
            return api.sendMessage(`╭━━━━━━⊱✨⊰━━━━━━╮\n   𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n❇️ 𝐓𝐨𝐭𝐚𝐥 𝐓𝐞𝐚𝐜𝐡: ${res.length}\n♻️ 𝐓𝐨𝐭𝐚𝐥 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞: ${res.responseLength}${sig}`, event.threadID, event.messageID);
        }

        // টিচ সিস্টেম (নতুন কিছু শেখানো)
        if (args[0] === 'teach') {
            const [quesPart, replyPart] = query.split(/\s*-\s*/);
            const question = quesPart.replace("teach ", "");
            if (!replyPart) return api.sendMessage(`❌ ফরম্যাট ভুল! সঠিক নিয়ম: teach প্রশ্ন - উত্তর${sig}`, event.threadID, event.messageID);
            
            const re = await axios.get(`${link}?teach=${encodeURIComponent(question)}&reply=${encodeURIComponent(replyPart)}&senderID=${uid}&threadID=${event.threadID}`);
            const teacherName = (await usersData.getName(uid)) || "Admin";
            return api.sendMessage(`✅ নতুন তথ্য যোগ করা হয়েছে!\n📝 প্রশ্ন: ${question}\n💌 উত্তর: ${replyPart}\n👤 শিক্ষক: ${teacherName}${sig}`, event.threadID, event.messageID);
        }

        // সাধারণ চ্যাট
        const res = await axios.get(`${link}?text=${encodeURIComponent(query)}&senderID=${uid}&font=1`);
        const reply = res.data.reply;
        
        api.sendMessage(reply, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: uid,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        api.sendMessage("❌ এপিআই সার্ভারে সমস্যা হচ্ছে, পরে চেষ্টা করুন!", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    if (api.getCurrentUserID() == event.senderID) return;
    try {
        const link = `${await baseApiUrl()}/baby`;
        const res = await axios.get(`${link}?text=${encodeURIComponent(event.body.toLowerCase())}&senderID=${event.senderID}&font=1`);
        const reply = res.data.reply;
        
        await api.sendMessage(reply, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID
            });
        }, event.messageID);
    } catch (err) {
        console.error(err);
    }
};

module.exports.onChat = async ({ api, event, message }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
        
        if (body.startsWith("baby") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("বট")) {
            const query = body.replace(/^\S+\s*/, "");
            
            if (!query) {
                const randomReplies = [
                    "বলো জানু, কি খবর? 🪬",
                    "হুম, আমায় ডাকলে কেন? 🙈",
                    "বেবি বলো না, লজ্জা পাই তো! 💋",
                    "আমার বস চাঁদের পাহাড় তোমার সাথে কথা বলতে মানা করেছে 🤐🤐",
                    "বেবি ডাকার আগে পারমিশন নিয়েছো? 🤨",
                    "আই লাভ ইউ সোনা 😘! ❤️✨"
                ];
                return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)] + sig, event.threadID, event.messageID);
            }

            const link = `${await baseApiUrl()}/baby`;
            const res = await axios.get(`${link}?text=${encodeURIComponent(query)}&senderID=${event.senderID}&font=1`);
            await api.sendMessage(res.data.reply, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }, event.messageID);
        }
    } catch (err) {
        console.error(err);
    }
};
                  
