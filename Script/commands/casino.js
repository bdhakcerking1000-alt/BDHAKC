module.exports.config = {
    name: "casino",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Chander Pahar x Gemini",
    description: "সবগুলো জুয়া খেলার কালেকশন (চাঁদের পাহাড় ক্যাসিনো)",
    commandCategory: "Games",
    usages: "[খেলা] [পছন্দ] [টাকা]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
    const axios = require('axios');
    const { createReadStream, writeFileSync, existsSync, mkdirSync } = require('fs-extra');
    const { threadID, messageID, senderID } = event;
    const pathImg = __dirname + '/cache/casino_banner.jpg';

    // ব্যানার ডাউনলোড চেক
    if (!existsSync(__dirname + '/cache')) mkdirSync(__dirname + '/cache');
    if (!existsSync(pathImg)) {
        let getImg = (await axios.get('https://i.imgur.com/1Y9eup1.jpg', { responseType: 'arraybuffer' })).data;
        writeFileSync(pathImg, Buffer.from(getImg, 'utf-8'));
    }

    const dataMoney = await Currencies.getData(senderID);
    const moneyUser = dataMoney.money;
    const choose = args[0] ? args[0].toLowerCase() : null;

    // মেইন মেনু
    if (!choose) {
        const msg = {
            body: `╭┈───────🎰───────┈╮\n   ✨ 𝗖𝗛𝗔𝗡𝗗𝗘𝗥 𝗣𝗔𝗛𝗔𝗥 ✨\n╰┈────────────────┈╯\n\n১. Big/Small (big/small) 🎲\n২. Even/Odd (even/odd) 🎴\n৩. Lottery (lottery) 💸\n৪. Difference (diff) 🎫\n৫. Slot Machine (slot) 🎰\n৬. Rock Paper Scissors (rps) ✌️\n\n💡 নিয়ম জানতে নম্বর লিখে রিপ্লাই দিন।\n\n🏔️ চাঁদের পাহাড় ক্যাসিনোতে আপনার ভাগ্য পরীক্ষা করুন!`,
            attachment: [createReadStream(pathImg)]
        };
        return api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "guide",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        }, messageID);
    }

    // common function for money check
    const checkMoney = (amount) => {
        if (isNaN(amount) || amount < 50) return "⚠️ সর্বনিম্ন ৫০$ বেট করতে হবে!";
        if (moneyUser < amount) return `❌ আপনার কাছে পর্যাপ্ত টাকা নেই! (ব্যালেন্স: ${moneyUser}$)`;
        return true;
    };

    // --- GAMES LOGIC ---
    
    // 1 & 2: Big/Small & Even/Odd
    if (['big', 'small', 'even', 'odd'].includes(choose)) {
        const bet = parseInt(args[1]);
        const mCheck = checkMoney(bet);
        if (mCheck !== true) return api.sendMessage(mCheck, threadID, messageID);

        const isBS = ['big', 'small'].includes(choose);
        const resultType = isBS ? (Math.random() > 0.5 ? 'big' : 'small') : (Math.random() > 0.5 ? 'even' : 'odd');
        const num = Math.floor(Math.random() * 10) + 1;

        if (choose === resultType) {
            await Currencies.increaseMoney(senderID, bet);
            return api.sendMessage(`🎉 আপনি জিতেছেন!\n🎰 ফলাফল: ${resultType.toUpperCase()} (${num})\n💰 লাভ: +${bet}$`, threadID, messageID);
        } else {
            await Currencies.decreaseMoney(senderID, bet);
            return api.sendMessage(`😢 আপনি হেরেছেন!\n🎰 ফলাফল: ${resultType.toUpperCase()} (${num})\n📉 ক্ষতি: -${bet}$`, threadID, messageID);
        }
    }

    // 3: Lottery
    if (choose === 'lottery') {
        const userNum = parseInt(args[1]);
        const bet = parseInt(args[2]);
        if (isNaN(userNum) || userNum < 0 || userNum > 9) return api.sendMessage("⚠️ লটারির জন্য ০-৯ এর মধ্যে একটি সংখ্যা দিন।", threadID, messageID);
        const mCheck = checkMoney(bet);
        if (mCheck !== true) return api.sendMessage(mCheck, threadID, messageID);

        const winNum = Math.floor(Math.random() * 10);
        api.sendMessage("🎰 লটারি ড্র হচ্ছে... ২ মিনিট পর ফলাফল জানানো হবে।", threadID);
        
        setTimeout(async () => {
            if (userNum === winNum) {
                await Currencies.increaseMoney(senderID, bet * 5);
                api.sendMessage(`🎊 অভিনন্দন! লটারিতে আপনার নম্বর ${userNum} মিলে গেছে!\n💰 আপনি পেয়েছেন: ${bet * 5}$`, threadID);
            } else {
                await Currencies.decreaseMoney(senderID, bet);
                api.sendMessage(`💔 কপাল খারাপ! বিজয়ী নম্বর ছিল ${winNum}।\n📉 আপনি ${bet}$ হারিয়েছেন।`, threadID);
            }
        }, 10000); // আপাতত ১০ সেকেন্ড দিলাম টেস্ট করার জন্য, আপনি চাইলে ১২০০০০ (২ মিনিট) করতে পারেন।
    }

    // 5: Slot
    if (choose === 'slot') {
        const bet = parseInt(args[1]);
        const mCheck = checkMoney(bet);
        if (mCheck !== true) return api.sendMessage(mCheck, threadID, messageID);

        const icons = ["🍇","🍉","🍊","🍏","🍓","🍒","🍌"];
        const s = [icons[Math.floor(Math.random()*icons.length)], icons[Math.floor(Math.random()*icons.length)], icons[Math.floor(Math.random()*icons.length)]];
        
        if (s[0] === s[1] && s[1] === s[2]) {
            await Currencies.increaseMoney(senderID, bet * 3);
            return api.sendMessage(`🎰 | ${s[0]} | ${s[1]} | ${s[2]} |\n🎊 জ্যাকপট! আপনি ৩ গুণ টাকা জিতেছেন! (+${bet*3}$)`, threadID, messageID);
        } else if (s[0] === s[1] || s[0] === s[2] || s[1] === s[2]) {
            await Currencies.increaseMoney(senderID, bet);
            return api.sendMessage(`🎰 | ${s[0]} | ${s[1]} | ${s[2]} |\n🎉 জোড়া মিলেছে! আপনি জিতেছেন। (+${bet}$)`, threadID, messageID);
        } else {
            await Currencies.decreaseMoney(senderID, bet);
            return api.sendMessage(`🎰 | ${s[0]} | ${s[1]} | ${s[2]} |\n😢 একটিও মেলেনি। আপনি ${bet}$ হারিয়েছেন।`, threadID, messageID);
        }
    }
};

module.exports.handleReply = async function({ event, api, handleReply }) {
    const { threadID, messageID, body, senderID } = event;
    if (handleReply.author != senderID) return;

    const prefix = global.config.PREFIX;
    let guide = "";
    switch(body) {
        case "1": guide = `🎲 Big/Small নিয়ম:\nব্যবহার: ${prefix}casino big 100\n(নম্বর ১-১০ এর মধ্যে ৪-১০ হলো Big, ১-৩ Small)`; break;
        case "2": guide = `🎴 Even/Odd নিয়ম:\nব্যবহার: ${prefix}casino even 100\n(জোড় বা বিজোড় সংখ্যা ধরা)`; break;
        case "3": guide = `💸 Lottery নিয়ম:\nব্যবহার: ${prefix}casino lottery [0-9] [টাকা]\n(জিতলে ৫ গুণ টাকা পাবেন!)`; break;
        case "4": guide = `🎫 Difference নিয়ম:\nব্যবহার: ${prefix}casino diff [পার্থক্য] [টাকা]`; break;
        case "5": guide = `🎰 Slot নিয়ম:\nব্যবহার: ${prefix}casino slot [টাকা]\n(আইকন মিললে টাকা পাবেন)`; break;
        case "6": guide = `✌️ RPS নিয়ম:\nব্যবহার: ${prefix}casino rps [rock/paper/scissors] [টাকা]`; break;
    }
    if (guide) api.sendMessage(guide, threadID, messageID);
};
