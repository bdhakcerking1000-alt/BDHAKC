module.exports.config = {
	name: "setprefixv2",
	version: "2.0.0",
	hasPermssion: 1, // শুধুমাত্র অ্যাডমিনরা প্রিফিক্স বদলাতে পারবে
	credits: "Belal x Gemini",
	description: "গ্রুপের বটের প্রিফিক্স পরিবর্তন করুন",
	commandCategory: "Group",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"successChange": "✅ সফলভাবে প্রিফিক্স পরিবর্তন করে '%1' করা হয়েছে।",
		"missingInput": "⚠️ প্রিফিক্স খালি রাখা যাবে না! কী সেট করতে চান তা লিখুন।",
		"resetPrefix": "🔄 প্রিফিক্স রিসেট করে বটের মেইন প্রিফিক্স '%1' এ আনা হয়েছে।",
		"confirmChange": "🎀 আপনি কি নিশ্চিত যে প্রিফিক্স বদলে '%1' করতে চান?\n\n👉 নিশ্চিত করতে এই মেসেজে একটি রিঅ্যাকশন দিন।"
	}
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		// শুধুমাত্র যে কমান্ড দিয়েছে সে রিঅ্যাকশন দিলেই কাজ করবে
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		
		let data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = handleReaction.PREFIX;
		
		// ডাটাবেজ এবং গ্লোবাল ডাটা আপডেট
		await Threads.setData(threadID, { data });
		global.data.threadData.set(String(threadID), data);
		
		api.unsendMessage(handleReaction.messageID);
		return api.sendMessage(getText("successChange", handleReaction.PREFIX), threadID);
	} catch (e) {
		console.log(e);
		return api.sendMessage("❌ প্রিফিক্স সেভ করতে সমস্যা হয়েছে!", event.threadID);
	}
};

module.exports.run = async ({ api, event, args, Threads, getText }) => {
	const { threadID, messageID, senderID } = event;

	if (typeof args[0] == "undefined") return api.sendMessage(getText("missingInput"), threadID, messageID);
	
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage(getText("missingInput"), threadID, messageID);

	// রিসেট লজিক
	if (prefix === "reset") {
		let data = (await Threads.getData(threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(threadID, { data });
		global.data.threadData.set(String(threadID), data);
		return api.sendMessage(getText("resetPrefix", global.config.PREFIX), threadID, messageID);
	} 
	
	// কনফার্মেশন মেসেজ
	return api.sendMessage(getText("confirmChange", prefix), threadID, (error, info) => {
		global.client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: senderID,
			PREFIX: prefix
		});
	}, messageID);
};
