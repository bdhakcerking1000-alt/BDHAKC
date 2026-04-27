module.exports.config = {
  name: "copy",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Chander Pahar x Gemini",
  description: "যেকোনো টেক্সটকে N বার কপি করে রিপিট করার উন্নত সিস্টেম",
  commandCategory: "utility",
  usages: "[Nx] [text] অথবা মেসেজ রিপ্লাই দিয়ে [Nx]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  
  try {
    // ১. সেফটি লিমিট (বট আইডি সেভ রাখতে ১০০-২০০ এর বেশি না দেওয়াই ভালো)
    const MAX_LIMIT = 200; 
    
    if (!args[0]) {
      return api.sendMessage(
        "🏔️ 𝗖𝗢𝗣𝗬 𝗚𝗨𝗜𝗗𝗘\n━━━━━━━━━━━━━━━\nব্যবহার বিধি:\n১. !copy 50x বেলাল\n২. মেসেজ রিপ্লাই দিয়ে লিখুন: !copy 20x",
        threadID, messageID
      );
    }

    // ২. 'x' ডিটেক্ট করা (যেমন: 50x, 50X, 50)
    const timesInput = args[0].toLowerCase();
    const timesMatch = timesInput.match(/^(\d+)(x)?$/);

    if (!timesMatch) {
      return api.sendMessage(
        "❌ আবাল, ফরম্যাট ঠিক কর!\nউদাহরণ: !copy 40x Rahat",
        threadID, messageID
      );
    }

    let times = parseInt(timesMatch[1], 10);
    
    if (isNaN(times) || times <= 0) return api.sendMessage("⚠️ সংখ্যাটি অবশ্যই ১ এর বেশি হতে হবে।", threadID, messageID);
    if (times > MAX_LIMIT) {
      api.sendMessage(`⚠️ নিরাপত্তার খাতিরে লিমিট ${MAX_LIMIT} সেট করা হয়েছে।`, threadID);
      times = MAX_LIMIT;
    }

    // ৩. টেক্সট সোর্স নির্ধারণ (আর্গুমেন্ট অথবা রিপ্লাই)
    let textToCopy = args.slice(1).join(" ").trim();
    if (!textToCopy && messageReply && messageReply.body) {
      textToCopy = messageReply.body.trim();
    }

    if (!textToCopy) {
      return api.sendMessage("⚠️ কপি করার জন্য কিছু তো লেখ বা রিপ্লাই দাও!", threadID, messageID);
    }

    // ৪. আউটপুট তৈরি করা (একদম নিখুঁত লাইন ব্রেকসহ)
    const resultArr = [];
    for (let i = 0; i < times; i++) {
      resultArr.push(textToCopy);
    }
    const finalOutput = resultArr.join("\n");

    // ৫. মেসেঞ্জার লেন্থ লিমিট হ্যান্ডলিং (স্মার্ট স্প্লিট)
    // মেসেঞ্জারে ২০০০ ক্যারেক্টারের বেশি পাঠালে সমস্যা হতে পারে, তাই ১০০০ করে ভাগ করা হয়েছে।
    const CHUNK_LIMIT = 1000;
    
    if (finalOutput.length <= CHUNK_LIMIT) {
      return api.sendMessage(finalOutput, threadID);
    } else {
      // বড় টেক্সট হলে অটো পার্ট করে পাঠাবে
      const parts = finalOutput.match(new RegExp(`.{1,${CHUNK_LIMIT}}`, 'gs')) || [];
      api.sendMessage(`🏔️ টেক্সট অনেক বড় হওয়ায় ${parts.length} টি মেসেজে পাঠানো হচ্ছে...`, threadID);
      
      for (const part of parts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // বট যেন স্প্যাম ব্লকে না পড়ে
        api.sendMessage(part, threadID);
      }
    }

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ কপি করার সময় একটি ত্রুটি ঘটেছে!", threadID, messageID);
  }
};
