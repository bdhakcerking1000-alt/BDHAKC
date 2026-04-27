const axios = require("axios");

// চাঁদের পাহাড়ের জন্য বিশেষ সিগনেচার
const AUTHOR = "BELAL ⊶ BOTX666 🪬";
const autoTagThreads = new Map();

module.exports = {
	config: {
		name: "autotag",
		version: "8.0",
		author: AUTHOR,
		countDown: 5,
		role: 1, // শুধুমাত্র অ্যাডমিন বা ওনার ব্যবহার করতে পারবে
		category: "box chat"
	},

	onStart: async function ({ message, event, args, api }) {
		const threadID = event.threadID;
		const sig = "┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

		// ❌ অফ করার সিস্টেম
		if (args[0] === "off") {
			if (autoTagThreads.has(threadID)) {
				clearInterval(autoTagThreads.get(threadID));
				autoTagThreads.delete(threadID);
				return message.reply(`❌ চাঁদের পাহাড়, অটো ট্যাগ বন্ধ করা হয়েছে।${sig}`);
			}
			return message.reply("⚠️ সিস্টেমটি আগে থেকেই অফ আছে।");
		}

		// ⚠️ অলরেডি রানিং থাকলে
		if (autoTagThreads.has(threadID)) {
			return message.reply("⚠️ চাঁদের পাহাড়, এই গ্রুপে অটো ট্যাগ অলরেডি রানিং আছে।");
		}

		// ⏰ মেইন ইন্টারভাল (প্রতি ২ ঘণ্টা পর পর)
		const interval = setInterval(async () => {
			try {
				const threadInfo = await api.getThreadInfo(threadID);
				const participantIDs = threadInfo.participantIDs;
				const now = new Date();

				// 🇧🇩 রিয়েল টাইম বাংলাদেশ
				const time = now.toLocaleTimeString("en-US", {
					timeZone: "Asia/Dhaka",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true
				});

				const date = now.toLocaleDateString("en-GB", {
					timeZone: "Asia/Dhaka",
					day: "2-digit",
					month: "long",
					year: "numeric"
				});

				// 🌦️ কুড়িগ্রামের আবহাওয়া (আপনার লোকেশন অনুযায়ী)
				let weather = "তথ্য পাওয়া যায়নি";
				try {
					const res = await axios.get("https://wttr.in/Kurigram?format=3");
					weather = res.data;
				} catch {}

				// 🎭 র্যান্ডম ইমোজি
				const emojis = ["🪬","🔥","🔱","⚡","👑","💎"];
				const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

				let body = `
╭━━━━━━━⊱🚨⊰━━━━━━━╮
   𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄 ${randomEmoji}
╰━━━━━━━⊱🚨⊰━━━━━━━╯

👥 @everyone
🚨 𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐋𝐄𝐑𝐓 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃 🚨

⚡ সবাই জলদি অনলাইনে আসুন!
🪬 চাঁদের পাহাড় নজর রাখছেন 👀🔥
━━━━━━━━━━━━━━━━━━━

⏰ 𝐓𝐢𝐦𝐞: ${time}
📅 𝐃𝐚𝐭𝐞: ${date}
🌦️ 𝐖𝐞𝐚𝐭𝐡𝐞𝐫: ${weather}

━━━━━━━━━━━━━━━━━━━

╭━━━━━━━⊱👑⊰━━━━━━━╮
      𝐑𝐎𝐘𝐀𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄𝐑
╰━━━━━━━⊱👑⊰━━━━━━━╯
⚔️ 𝐍𝐀𝐌𝐄 ➤ ✡️⃝🅰🅳🅼🅸🅽 ◎⃝😘─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️⎞
🏠 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 ➤ KURIGRAM, BD 🇧🇩
📚 𝐏𝐑𝐎 ➤ STUDENT & DEVELOPER
🔥 𝐁𝐑𝐀𝐍𝐃 ➤ BOTX666 SYSTEM 🪬
━━━━━━━━━━━━━━━━━━━
🔱 "শান্ত থাকি বলে দুর্বল ভেবো না...
  বংশ পরিচয়ই আমার আভিজাত্য!" ⚡
━━━━━━━━━━━━━━━━━━━

🔗 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:
https://www.facebook.com/profile.php?id=61577502464880

━━━━━━━━━━━━━━━━━━━
      ${sig}
━━━━━━━━━━━━━━━━━━━
`;

				let index = body.indexOf("@everyone");
				const mentions = [];

				for (const uid of participantIDs) {
					mentions.push({
						tag: "@",
						id: uid,
						fromIndex: index
					});
				}

				// 📤 মেসেজ পাঠানো
				api.sendMessage({ body, mentions }, threadID, (err, info) => {
					if (!err) {
						// 🗑️ ২ মিনিট পর মেসেজটি অটো ডিলিট হয়ে যাবে
						setTimeout(() => {
							api.unsendMessage(info.messageID);
						}, 2 * 60 * 1000);
					}
				});

			} catch (err) {
				console.log(err);
			}

		}, 2 * 60 * 60 * 1000); // ২ ঘণ্টা পর পর

		autoTagThreads.set(threadID, interval);

		return message.reply(`✅ চাঁদের পাহাড়, অটো ট্যাগ সফলভাবে চালু হয়েছে (প্রতি ২ ঘণ্টা অন্তর)।${sig}`);
	}
};
