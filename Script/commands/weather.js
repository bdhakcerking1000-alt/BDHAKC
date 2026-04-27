const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "weather",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "অটোমেটিক আবহাওয়া আপডেট (২৪ ঘণ্টায় ৭ বার)",
    commandCategory: "utility",
    usages: "[শহরের নাম]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "moment-timezone": ""
    }
};

// অটোমেটিক পাঠানোর সময় ব্যবধান (২৪ ঘণ্টা / ৭ বার = প্রায় ৩.৫ ঘণ্টা)
const BROADCAST_INTERVAL = 3.5 * 60 * 60 * 1000; 
let lastBroadcast = 0;

module.exports.handleEvent = async function({ api, event }) {
    const now = Date.now();
    const threadID = event.threadID;

    // চেক: নির্দিষ্ট সময় পার হয়েছে কি না এবং এটি গ্রুপ চ্যাট কি না
    if (now - lastBroadcast > BROADCAST_INTERVAL && event.isGroup) {
        lastBroadcast = now;
        const apiKey = "b7f1db5959a1f5b2a079912b03f0cd96";
        
        try {
            const kq = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Kurigram&appid=${apiKey}&units=metric&lang=bn`);
            const rm = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Rowmari&appid=${apiKey}&units=metric&lang=bn`);

            const time = moment.tz("Asia/Dhaka").format("hh:mm A");
            
            let autoMsg = `🔔 [ অটো আবহাওয়া আপডেট | ${time} ] 🔔\n━━━━━━━━━━━━━━━\n`;
            autoMsg += `📍 কুড়িগ্রাম: ${kq.data.main.temp}°C (${kq.data.weather[0].description})\n`;
            autoMsg += `📍 রৌমারী: ${rm.data.main.temp}°C (${rm.data.weather[0].description})\n`;
            autoMsg += `━━━━━━━━━━━━━━━\n💡 বেলাল ভাই, আপনার এলাকার বর্তমান অবস্থা এটি।`;

            return api.sendMessage(autoMsg, threadID);
        } catch (e) {
            console.log("Auto-weather error:", e);
        }
    }
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const apiKey = "b7f1db5959a1f5b2a079912b03f0cd96";
    let city = args.join(" ");

    if (!city) {
        try {
            const kq = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Kurigram&appid=${apiKey}&units=metric&lang=bn`);
            const rm = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Rowmari&appid=${apiKey}&units=metric&lang=bn`);
            
            let msg = `🌟 [ কুড়িগ্রাম ও রৌমারী আপডেট ] 🌟\n━━━━━━━━━━━━━━━\n`;
            msg += `📍 কুড়িগ্রাম: ${kq.data.main.temp}°C (${kq.data.weather[0].description})\n`;
            msg += `📍 রৌমারী: ${rm.data.main.temp}°C (${rm.data.weather[0].description})\n`;
            msg += `━━━━━━━━━━━━━━━\n💡 অন্য শহরের জন্য 'weather [নাম]' লিখুন।`;
            
            return api.sendMessage(msg, threadID, messageID);
        } catch (e) {
            return api.sendMessage("⚠️ ডাটা লোড করতে সমস্যা হচ্ছে!", threadID, messageID);
        }
    }

    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=bn`);
        const data = res.data;
        const sunrise = moment.unix(data.sys.sunrise).tz("Asia/Dhaka").format("hh:mm A");
        const sunset = moment.unix(data.sys.sunset).tz("Asia/Dhaka").format("hh:mm A");

        const info = `🌈 আবহাওয়ার প্রতিবেদন: ${data.name}\n━━━━━━━━━━━━━━━\n🌡️ তাপমাত্রা: ${data.main.temp}°C\n🔥 অনুভব: ${data.main.feels_like}°C\n☁️ অবস্থা: ${data.weather[0].description}\n💧 আর্দ্রতা: ${data.main.humidity}%\n💨 বাতাস: ${data.wind.speed} km/h\n🌅 সূর্যোদয়: ${sunrise}\n🌄 সূর্যাস্ত: ${sunset}\n━━━━━━━━━━━━━━━\nবেলাল ভাই, তথ্যটি চেক করে নিন! ✅`;

        return api.sendMessage(info, threadID, messageID);
    } catch (err) {
        return api.sendMessage(`❌ '${city}' পাওয়া যায়নি।`, threadID, messageID);
    }
};
