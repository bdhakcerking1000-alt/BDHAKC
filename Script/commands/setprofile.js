module.exports.config = {
  name: "setprofile",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Belal x Gemini",
  description: "ছবির রিপ্লাই দিয়ে বটের প্রোফাইল পিকচার সেট করুন",
  commandCategory: "Admin",
  usages: "[reply to a photo]",
  cooldowns: 10
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, messageReply, senderID } = event;
  const GOD_ID = "61582708907708"; // বেলাল ভাইয়ের ফিক্সড আইডি

  // ১. পারমিশন প্রোটেকশন
  if (senderID !== GOD_ID) {
    return api.sendMessage("⛔ বেলাল ভাই ছাড়া কেউ বটের ছবি পাল্টাতে পারবে না!", threadID, messageID);
  }

  try {
    // ২. অ্যাটাচমেন্ট ভ্যালিডেশন
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("⚠️ বেলাল ভাই, যে ছবিটা সেট করতে চান সেটার ওপর রিপ্লাই দিয়ে কমান্ডটি লিখুন!", threadID, messageID);
    }

    const imgData = messageReply.attachments[0];
    if (imgData.type !== "photo") {
      return api.sendMessage("⚠️ এটা তো ছবি না! শুধুমাত্র ছবিতে রিপ্লাই করুন।", threadID, messageID);
    }

    api.setMessageReaction("⌛", messageID, () => {}, true);
    api.sendMessage("🔄 বটের নতুন প্রোফাইল ছবি সেট করা হচ্ছে, একটু অপেক্ষা করুন...", threadID, messageID);

    // ৩. চেঞ্জ অ্যাভাটার লজিক (V2 মেথড)
    // অনেক সময় changeAvatarV2 সাপোর্ট না করলে আমরা ফেইলওভার ব্যবহার করবো
    const setAvatar = api.changeAvatarV2 || api.changeAvatar;

    setAvatar(imgData.url, "Profile updated by Master Belal 👑", (err) => {
      if (err) {
        console.error(err);
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("❌ ছবি পরিবর্তন ব্যর্থ হয়েছে! ফেসবুকের সার্ভার লিমিট বা এপিআই সমস্যা হতে পারে।", threadID, messageID);
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage("✅ ওক্কে বস! বটের প্রোফাইল পিকচার এখন আপডেট হয়ে গেছে। 😎", threadID, messageID);
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("🚨 সিস্টেম এরর! আবার চেষ্টা করুন বেলাল ভাই।", threadID, messageID);
  }
};
