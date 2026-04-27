const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
	config: {
		name: "setwelcome",
		aliases: ["setwc", "welcomeconfig"],
		version: "2.8.0",
		author: "BELAL ⊶ BOTX666 🪬",
		countDown: 5,
		role: 1,
		shortDescription: { en: "নতুন মেম্বারদের স্বাগতম জানানোর সেটিংস" },
		category: "admin",
		guide: {
			en: "╭━━━❖✦🪬✦❖━━━╮\n  ✡️  চাঁদের 𖤍 পাহাড়  🪬\n╰━━━❖✦🪬✦❖━━━╯\n\n"
				+ "📝 𝗧𝗲𝘅𝘁 𝗦𝗲𝘁:\n{pn} text [মেসেজ] (Shortcuts: {userName}, {userNameTag}, {boxName})\n\n"
				+ "🖼️ 𝗙𝗶𝗹𝗲 𝗦𝗲𝘁:\n{pn} file (ছবি/ভিডিওতে রিপ্লাই দিন)\n\n"
				+ "⚙️ 𝗖𝗼𝗻𝘁𝗿𝗼𝗹:\n{pn} on/off (চালু বা বন্ধ করুন)\n"
				+ "{pn} text reset (মেসেজ মুছুন)\n"
				+ "{pn} file reset (মিডিয়া মুছুন)"
		}
	},

	onStart: async function ({ args, threadsData, message, event, commandName }) {
		const { threadID, senderID, body } = event;
		const { data, settings } = await threadsData.get(threadID);
		const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

		switch (args[0]?.toLowerCase()) {
			case "text": {
				if (!args[1]) return message.reply("⚠️ চাঁদের পাহাড়, স্বাগতম মেসেজের জন্য কিছু টেক্সট লিখুন!");
				
				if (args[1] == "reset") {
					delete data.welcomeMessage;
					await threadsData.set(threadID, { data });
					return message.reply("🔄 চাঁদের পাহাড়, স্বাগতম মেসেজটি রিসেট করা হয়েছে।");
				} else {
					data.welcomeMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
					await threadsData.set(threadID, { data });
					return message.reply(`╭━━━━━━⊱⚙️⊰━━━━━━╮\n   𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n✅ নতুন মেসেজ সেট করা হয়েছে:\n"${data.welcomeMessage}"\n\n𖤍 𝗔𝗱𝗺𝗶𝗻 : BELAL ⊶ BOTX666 🪬${sig}`);
				}
			}

			case "file": {
				if (args[1] == "reset") {
					if (!data.welcomeAttachment || data.welcomeAttachment.length == 0)
						return message.reply("⚠️ চাঁদের পাহাড়, ডিলেট করার মতো কোনো ফাইল খুঁজে পাওয়া যায়নি।");
					try {
						await Promise.all(data.welcomeAttachment.map(fileId => drive.deleteFile(fileId)));
						delete data.welcomeAttachment;
					} catch (e) { console.error(e); }
					await threadsData.set(threadID, { data });
					return message.reply("🔄 চাঁদের পাহাড়, স্বাগতম মিডিয়া ফাইলগুলো মুছে ফেলা হয়েছে।");
				}

				if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0)) {
					return message.reply("📸 চাঁদের পাহাড়, এই মেসেজে একটি ছবি/ভিডিও/অডিও ফাইল দিয়ে রিপ্লাই দিন।", (err, info) => {
						global.GoatBot.onReply.set(info.messageID, {
							messageID: info.messageID,
							author: senderID,
							commandName
						});
					});
				} else {
					await saveChanges(message, event, threadID, senderID, threadsData, sig);
				}
				break;
			}

			case "on":
			case "off": {
				settings.sendWelcomeMessage = args[0] == "on";
				await threadsData.set(threadID, { settings });
				return message.reply(settings.sendWelcomeMessage ? "✅ চাঁদের পাহাড়, স্বাগতম মেসেজ সিস্টেম চালু করা হয়েছে।" : "❌ চাঁদের পাহাড়, স্বাগতম মেসেজ সিস্টেম বন্ধ করা হয়েছে।");
			}

			default:
				return message.reply("❌ ভুল কমান্ড! সঠিক নিয়মের জন্য লিখুন: /setwelcome help");
		}
	},

	onReply: async function ({ event, Reply, message, threadsData }) {
		const { threadID, senderID } = event;
		const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";
		if (senderID != Reply.author) return;

		if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
			return message.reply("⚠️ চাঁদের পাহাড়, দয়া করে ফাইলসহ রিপ্লাই দিন!");
		
		await saveChanges(message, event, threadID, senderID, threadsData, sig);
	}
};

async function saveChanges(message, event, threadID, senderID, threadsData, sig) {
	const { data } = await threadsData.get(threadID);
	const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => ["photo", 'png', "animated_image", "video", "audio"].includes(item.type));
	
	if (!data.welcomeAttachment) data.welcomeAttachment = [];

	try {
		await Promise.all(attachments.map(async attachment => {
			const { url } = attachment;
			const ext = getExtFromUrl(url);
			const fileName = `${getTime()}.${ext}`;
			const infoFile = await drive.uploadFile(`setwelcome_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
			data.welcomeAttachment.push(infoFile.id);
		}));

		await threadsData.set(threadID, { data });
		return message.reply(`╭━━━━━━⊱🎬⊰━━━━━━╮\n   𝗠𝗘𝗗𝗜𝗔 𝗔𝗗𝗗𝗘𝗗\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n✅ চাঁদের পাহাড়, সফলভাবে ${attachments.length}টি মিডিয়া ফাইল স্বাগতম লিস্টে যুক্ত করা হয়েছে।\n\n𖤍 𝗔𝗱𝗺𝗶𝗻 : BELAL ⊶ BOTX666 🪬${sig}`);
	} catch (e) {
		return message.reply("❌ চাঁদের পাহাড়, ফাইল আপলোড করতে সমস্যা হয়েছে। গুগল ড্রাইভ পারমিশন চেক করুন।");
	}
}
