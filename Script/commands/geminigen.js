const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiUrlStore = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";

async function getApiUrl() {
    const res = await axios.get(apiUrlStore);
    return res.data.apiv3;
}

async function urlToBase64(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data).toString("base64");
}

module.exports = {
    config: {
        name: "geminigen",
        aliases: ["gem", "ai-gen"],
        version: "2.1.0",
        author: "BOTX666 🪬",
        countDown: 10,
        role: 0,
        shortDescription: { en: "Create or enhance images using AI" },
        category: "ai",
        guide: {
            en: "{p}geminigen <prompt> - নতুন ছবি তৈরি করতে\n{p}geminigen <prompt> - ছবির ওপর রিপ্লাই দিয়ে এডিট করতে"
        }
    },

    onStart: async function ({ api, event, args, message }) {
        const { threadID, messageID, messageReply } = event;
        const prompt = args.join(" ").trim();
        const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

        // ১. প্রম্পট চেক
        if (!prompt) {
            return message.reply(`⚠️ চাঁদের পাহাড়, আপনি কী ধরনের ছবি তৈরি করতে চান তা লিখে দিন।${sig}`);
        }

        const processingMsg = await message.reply("🎨 𝐒𝐲𝐬𝐭𝐞𝐦: আপনার ছবিটি তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...");
        api.setMessageReaction("⏳", messageID, () => {}, true);

        const imgPath = path.join(__dirname, "cache", `gemgen_${Date.now()}.jpg`);
        const repliedImage = messageReply?.attachments?.[0];

        try {
            const API_URL = await getApiUrl();
            const payload = {
                prompt: repliedImage && repliedImage.type === "photo"
                    ? `Enhance/Modify this image: ${prompt}`
                    : `Generate high-quality artwork: ${prompt}`,
                format: "jpg"
            };

            if (repliedImage && repliedImage.type === "photo") {
                payload.images = [await urlToBase64(repliedImage.url)];
            }

            // ২. এপিআই কল
            const res = await axios.post(API_URL, payload, {
                responseType: "arraybuffer",
                timeout: 180000
            });

            await fs.ensureDir(path.dirname(imgPath));
            await fs.writeFile(imgPath, Buffer.from(res.data));

            if (processingMsg?.messageID) await api.unsendMessage(processingMsg.messageID);
            api.setMessageReaction("✅", messageID, () => {}, true);

            // ৩. ফাইনাল আউটপুট ডিজাইন
            await message.reply({
                body: `🎨 𝐆𝐞𝐦𝐢𝐧𝐢 𝐀𝐈 𝐀𝐫𝐭𝐰𝐨𝐫𝐤 🎨\n━━━━━━━━━━━━━━\n📝 𝐏𝐫𝐨𝐦𝐩𝐭: ${prompt}${sig}`,
                attachment: fs.createReadStream(imgPath)
            }, () => {
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            });

        } catch (error) {
            console.error("GEMINIGEN Error:", error.message);
            if (processingMsg?.messageID) await api.unsendMessage(processingMsg.messageID);
            api.setMessageReaction("❌", messageID, () => {}, true);
            message.reply("❌ দুঃখিত, যান্ত্রিক ত্রুটির কারণে ছবি তৈরি করা সম্ভব হয়নি!");
        }
    }
};
