const axios = require('axios');
const yts = require("yt-search");
const fs = require("fs-extra");

async function getBaseApi() {
    try {
        const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
        return base.data.api;
    } catch (e) {
        return "https://de01.d1pt0.000.pe"; // Fallback API
    }
}

function getVideoID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : null;
}

module.exports = {
    config: {
        name: "videov4",
        version: "1.0.1",
        author: "BELAL ⊶ BOTX666 🪬",
        role: 0,
        countDown: 10,
        description: "ইউটিউব থেকে ভিডিও ডাউনলোড করার উন্নত ভার্সন",
        category: "media",
        usePrefix: true
    },

    onStart: async function ({ api, args, event }) {
        const { threadID, messageID } = event;
        const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
        
        if (!args[0]) return api.sendMessage(`❌ চাঁদের পাহাড়, ভিডিওর নাম বা লিঙ্ক দিন।${sig}`, threadID, messageID);

        let waitMsg;
        try {
            let videoID;
            const url = args[0];
            const diptoApi = await getBaseApi();

            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                videoID = getVideoID(url);
                if (!videoID) return api.sendMessage("❌ ইনভ্যালিড ইউটিউব লিঙ্ক!", threadID, messageID);
                waitMsg = await api.sendMessage(`⌛ লিঙ্ক থেকে ভিডিওটি প্রসেস করা হচ্ছে...`, threadID);
            } else {
                const songName = args.join(' ');
                waitMsg = await api.sendMessage(`🔎 চাঁদের পাহাড়, ইউটিউবে "${songName}" সার্চ করা হচ্ছে...`, threadID);
                const r = await yts(songName);
                const videoData = r.videos[0];
                if (!videoData) throw new Error("কোনো ভিডিও পাওয়া যায়নি!");
                videoID = videoData.videoId;
            }

            // ভিডিও মেটাডেটা এবং লিঙ্ক সংগ্রহ
            const res = await axios.get(`${diptoApi}/ytDl3?link=${videoID}&format=mp4`);
            const { title, quality, downloadLink } = res.data.data;

            if (!downloadLink) throw new Error("ডাউনলোড লিঙ্ক জেনারেট করতে ব্যর্থ হয়েছে।");

            // লিঙ্ক শর্টনার
            let shortenedLink = "N/A";
            try {
                const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`);
                shortenedLink = tiny.data;
            } catch (e) { shortenedLink = "Link too long"; }

            // ফাইল স্ট্রিম করে পাঠানো
            const stream = await axios({
                method: 'get',
                url: downloadLink,
                responseType: 'stream'
            });

            await api.unsendMessage(waitMsg.messageID);

            return api.sendMessage({
                body: `╭━━━━━━⊱✅⊰━━━━━━╮\n   𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n🔖 𝐓𝐢𝐭𝐥𝐞: ${title}\n✨ 𝐐𝐮𝐚𝐥𝐢𝐭𝐲: ${quality}\n🔗 𝐒𝐡𝐨𝐫𝐭 𝐋𝐢𝐧𝐤: ${shortenedLink}\n\n𖤍 𝐀𝐝𝐦𝐢𝐧: MD BELAL (BS Dealer)\n🏠 𝐇𝐨𝐦𝐞: KURIGRAM, BD${sig}`,
                attachment: stream.data
            }, threadID, messageID);

        } catch (e) {
            console.error(e);
            if (waitMsg) api.unsendMessage(waitMsg.messageID);
            api.sendMessage(`❌ এরর: ${e.message || "ভিডিওটি ডাউনলোড করা সম্ভব হয়নি।"}${sig}`, threadID, messageID);
        }
    }
};
