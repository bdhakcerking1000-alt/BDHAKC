const schedule = require('node-schedule');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
  name: "autosent",
  version: "64.0.0",
  hasPermssion: 2,
  credits: "Master Belal",
  description: "Auto-Caption with Real-time Roumari Weather Engine",
  commandCategory: "System",
  usages: "autosent",
  cooldowns: 5
};

// ৫টি ভিন্ন ভিন্ন ডাইনামিক আর্ট লেআউট
const getLayout = (caption, time, date, day, weather) => {
  const layouts = [
    `💠 ━━━ ❮ 𝐄𝐋𝐈𝐓𝐄 𝐍𝐄𝐓𝐖𝐎𝐑𝐊 ❯ ━━━ 💠\n\n📜 "${caption}"\n\n🌍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧: Roumari, Kurigram\n🌡️ 𝐓𝐞𝐦𝐩: ${weather}\n\n◈━━━━━━━━━━━━━━━━━━━◈\n⌚ 𝐓𝐢𝐦𝐞 : ${time}\n📅 𝐃𝐚𝐭𝐞 : ${date} (${day})\n◈━━━━━━━━━━━━━━━━━━━◈\n┈──╼ ❈✡️চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ🪬❈ ╾──┈`,

    `✨ ────╼ ✡️ 𝐕𝟔𝟒-𝐏𝐑𝐎 ✡️ ╾──── ✨\n\n💎 𝐐𝐮𝐨𝐭𝐞: ${caption}\n\n⛅ 𝐑𝐨𝐮𝐦𝐚𝐫𝐢 𝐒𝐤𝐲: ${weather}\n⏰ 𝐋𝐢𝐯𝐞 𝐓𝐢𝐦𝐞: ${time}\n\n💠 ━━━━━━━━━━━━━━━━━━━ 💠\n🏔️ 𝐒𝐢𝐠𝐧: 𝐂𝐡𝐚𝐧𝐝𝐞𝐫 𝐏𝐚𝐡𝐚𝐫 🪬`,

    `👑 ━━━『 𝐑𝐎𝐔𝐌𝐀𝐑𝐈 𝐄𝐃𝐈𝐓𝐈𝐎𝐍 』━━━ 👑\n\n🏮 "${caption}"\n\n💠 𝐋𝐢𝐯𝐞 𝐒𝐭𝐚𝐭𝐮𝐬:\n┏━━━━━━━━━━━━━━━━━━━┓\n┃ 🕒 𝐓𝐢𝐦𝐞: ${time}\n┃ 🌡️ 𝐖𝐞𝐚𝐭𝐡𝐞𝐫: ${weather}\n┃ 📅 𝐃𝐚𝐭𝐞: ${date}\n┗━━━━━━━━━━━━━━━━━━━┛\n┈──╼ ❈✡️চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ🪬❈ ╾──┈`,

    `🚀 𝐍𝐄𝐓𝐖𝐎𝐑𝐊 𝐎𝐌𝐍𝐈 𝐀𝐂𝐓𝐈𝐕𝐄 ⚡\n━━━━━━━━━━━━━━━━━━━━\n\n🎙️ 𝐂𝐚𝐩𝐭𝐢𝐨𝐧: ${caption}\n🌦️ 𝐖𝐞𝐚𝐭𝐡𝐞𝐫: ${weather} (রৌমারী)\n\n⌛ 𝐓𝐢𝐦𝐞: ${time}\n📆 𝐃𝐚𝐲: ${day}\n━━━━━━━━━━━━━━━━━━━━\n🏔️ 𝐒𝐢𝐠𝐧: 𝐂𝐡𝐚𝐧𝐝𝐞𝐫 𝐏𝐚𝐡𝐚𝐫 💠`,

    `💖 ━┈ 🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌸 ┈━ 💖\n\n✨ "${caption}"\n\n🌡️ রৌমারীর তাপমাত্রা: ${weather}\n🕒 সময়: ${time} | 🗓️ ${day}\n📅 তারিখ: ${date}\n━━━━━━━━━━━━━━━━━━━━\n┈──╼ ❈✡️চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ🪬❈ ╾──┈`
  ];
  return layouts[Math.floor(Math.random() * layouts.length)];
};

module.exports.onLoad = ({ api }) => {
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Dhaka';
  rule.minute = 0; 

  schedule.scheduleJob(rule, async () => {
    try {
      // ১. ক্যাপশন এপিআই
      let caption = "Stay focused and never give up.";
      try {
        const res = await axios.get("https://api.popcat.xyz/quote");
        caption = res.data.quote;
      } catch (e) { console.log("Quote API Error"); }

      // ২. রৌমারী আবহাওয়া এপিআই (Real-time)
      let weatherInfo = "Data Unavailable";
      try {
        const weatherRes = await axios.get("https://api.weatherapi.com/v1/current.json?key=89345e656d78457790d130545231205&q=Roumari&aqi=no");
        const temp = weatherRes.data.current.temp_c;
        const condition = weatherRes.data.current.condition.text;
        weatherInfo = `${temp}°C | ${condition}`;
      } catch (e) { console.log("Weather API Error"); }
      
      const now = moment().tz('Asia/Dhaka');
      const time = now.format('hh:mm A');
      const date = now.format('DD/MM/YYYY');
      const day = now.format('dddd');

      const finalMsg = getLayout(caption, time, date, day, weatherInfo);

      const allThreads = global.data.allThreadID || [];
      for (const tID of allThreads) {
        api.sendMessage(finalMsg, tID);
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) { console.log("Autosent Error:", err); }
  });
};

module.exports.run = async ({ api, event }) => {
  const sig = `\n━━━━━━━━━━━━━━━━━━━━\n🏔️ 𝐒𝐢𝐠𝐧: 𝐂𝐡𝐚𝐧𝐝𝐞𝐫 𝐏𝐚𝐡𝐚𝐫 🪬`;
  return api.sendMessage(`✅ 𝐀𝐮𝐭𝐨𝐬𝐞𝐧𝐭 𝐕𝟔𝟒 (𝐑𝐨𝐮𝐦𝐚𝐫𝐢 𝐖𝐞𝐚𝐭𝐡𝐞𝐫 𝐄𝐝𝐢𝐭𝐢𝐨𝐧) সক্রিয়!\n📍 কুড়িগ্রাম রৌমারীর লাইভ আবহাওয়াসহ প্রতি ঘন্টায় মেসেজ যাবে।${sig}`, event.threadID);
};
      
