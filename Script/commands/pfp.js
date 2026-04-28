const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "pfp",
        aliases: ["pp", "profilepic", "profile", "avatar"],
        version: "2.1.0",
        author: "BOTX666 🪬",
        countDown: 5,
        role: 0,
        description: {
            en: "Fetch user's high-quality profile picture"
        },
        category: "utility",
        guide: {
            en: '{pn}: আপনার নিজের ছবি\n{pn} @tag: যাকে ট্যাগ করবেন তার ছবি\n{pn} <uid>: ইউজার আইডি দিয়ে ছবি\n(অথবা কারো মেসেজে রিপ্লাই দিন)'
        }
    },

    onStart: async function ({ api, message, args, event, usersData }) {
        const { threadID, messageID, senderID, mentions, messageReply } = event;
        
        // সময় ও তারিখ সেটআপ (Asia/Dhaka)
        const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
        const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
        const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

        try {
            let uid = senderID;

            // টার্গেট আইডি নির্ধারণ
            if (messageReply) {
                uid = messageReply.senderID;
            } else if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
            } else if (args[0]) {
                if (!isNaN(args[0])) {
                    uid = args[0];
                } else if (args[0].includes("facebook.com/")) {
                    // লিঙ্ক থেকে আইডি বের করার চেষ্টা (সিম্পল লজিক)
                    const match = args[0].match(/(?:profile\.php\?id=|\/)([\d]+)/);
                    if (match) uid = match[1];
                }
            }

            if (!uid || isNaN(uid)) return message.reply(`❌ চাঁদের পাহাড়, সঠিক ইউজার আইডি বা মেনশন দিন।${sig}`);

            api.setMessageReaction("🔍", messageID, () => {}, true);

            const userName = await usersData.getName(uid);
            const avatarURL = `https://graph.facebook.com/${uid}/picture?width=1024&height=1024&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const cachePath = path.join(__dirname, "cache", `pfp_${uid}_${Date.now()}.jpg`);
            await fs.ensureDir(path.dirname(cachePath));

            const response = await axios.get(avatarURL, { responseType: "arraybuffer" });
            await fs.writeFile(cachePath, Buffer.from(response.data));

            api.setMessageReaction("✅", messageID, () => {}, true);

            await message.reply({
                body: `👤 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞 𝐅𝐨𝐮𝐧𝐝!\n━━━━━━━━━━━━━━━━━━━━\n👤 𝐍𝐚𝐦𝐞: ${userName}\n🆔 𝐔𝐈𝐃: ${uid}${sig}`,
                attachment: fs.createReadStream(cachePath)
            });

            await fs.remove(cachePath);
        } catch (err) {
            api.setMessageReaction("❌", messageID, () => {}, true);
            console.error("Error in pfp command:", err);
            return message.reply(`❌ দুঃখিত, প্রোফাইল পিকচার পাওয়া যায়নি।${sig}`);
        }
    }
};
