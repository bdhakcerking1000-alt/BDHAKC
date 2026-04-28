const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "meta",
        aliases: ["metaai", "metagen", "imagine"],
        version: "2.5.1",
        author: "BOTX666 🪬",
        countDown: 20,
        role: 0,
        category: "ai-image",
        guide: {
            en: "{pn} <আপনার কল্পনা>\nউদাহরণ: {pn} a futuristic city in rain"
        }
    },

    onStart: async function({ api, message, args, event, commandName }) {
        const { threadID, messageID, senderID } = event;
        const prompt = args.join(" ");
        const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
        const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
        const sig = `\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${time}\n📅 তারিখ: ${date}`;

        if (!prompt) return message.reply(`⚠️ চাঁদের পাহাড়, আপনি কী ধরনের ছবি চান তা লিখে দিন।${sig}`);

        api.setMessageReaction("⏳", messageID, () => {}, true);
        const cacheDir = path.join(__dirname, 'cache');
        await fs.ensureDir(cacheDir);

        const tempPaths = [];
        let gridPath = '';

        try {
            const API_ENDPOINT = "https://metakexbyneokex.fly.dev/images/generate";
            const response = await axios.post(API_ENDPOINT, { prompt: prompt.trim() }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 150000
            });

            if (!response.data.success || !response.data.images) throw new Error("API Error");

            const imageUrls = response.data.images.slice(0, 4).map(img => img.url);

            // ১. ছবিগুলো ডাউনলোড করা
            for (let i = 0; i < imageUrls.length; i++) {
                const imgData = (await axios.get(imageUrls[i], { responseType: 'arraybuffer' })).data;
                const imgPath = path.join(cacheDir, `meta_${Date.now()}_${i}.png`);
                await fs.writeFile(imgPath, imgData);
                tempPaths.push(imgPath);
            }

            // ২. প্রিমিয়াম গ্রিড তৈরি (Canvas)
            gridPath = path.join(cacheDir, `grid_${Date.now()}.png`);
            await createGrid(tempPaths, gridPath);

            api.setMessageReaction("✅", messageID, () => {}, true);

            // ৩. রিপ্লাই সিস্টেম সহ আউটপুট
            await message.reply({
                body: `🔮 𝐌𝐄𝐓𝐀-𝐀𝐈 𝐆𝐑𝐈𝐃 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 🔮\n${"━".repeat(20)}\n💡 ১, ২, ৩, ৪ অথবা "all" লিখে রিপ্লাই দিন।${sig}`,
                attachment: fs.createReadStream(gridPath)
            }, (err, info) => {
                if (!err) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName,
                        author: senderID,
                        imageUrls,
                        tempPaths,
                        gridPath
                    });
                }
            });

        } catch (error) {
            api.setMessageReaction("❌", messageID, () => {}, true);
            console.error(error);
            return message.reply("❌ ছবি জেনারেট করতে সমস্যা হয়েছে। পরে চেষ্টা করুন।");
        }
    },

    onReply: async function({ api, message, event, Reply }) {
        const { imageUrls, tempPaths, gridPath, author } = Reply;
        if (event.senderID !== author) return;

        const input = event.body.trim().toLowerCase();
        const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
        const sig = `\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ ${time}`;

        try {
            api.setMessageReaction("⏳", event.messageID, () => {}, true);

            if (input === 'all') {
                const streams = [];
                for (const url of imageUrls) {
                    const res = await axios.get(url, { responseType: 'stream' });
                    streams.push(res.data);
                }
                await message.reply({ body: `✨ আপনার সবগুলো ছবি এখানে:${sig}`, attachment: streams });
            } else {
                const i = parseInt(input) - 1;
                if (i < 0 || i > 3) return;
                const res = await axios.get(imageUrls[i], { responseType: 'stream' });
                await message.reply({ body: `✅ ছবি নম্বর ${input} জেনারেট হয়েছে:${sig}`, attachment: res.data });
            }
            api.setMessageReaction("✅", event.messageID, () => {}, true);
        } catch (e) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
        } finally {
            // ক্লিনআপ
            tempPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
            if (fs.existsSync(gridPath)) fs.unlinkSync(gridPath);
            global.GoatBot.onReply.delete(Reply.messageID);
        }
    }
};

async function createGrid(paths, output) {
    const images = await Promise.all(paths.map(p => loadImage(p)));
    const size = 512; // প্রতিটি ইমেজের সাইজ
    const canvas = createCanvas(size * 2 + 15, size * 2 + 15);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#000000"; // ব্যাকগ্রাউন্ড কালার
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pos = [{x:5,y:5}, {x:size+10,y:5}, {x:5,y:size+10}, {x:size+10,y:size+10}];
    images.forEach((img, i) => {
        ctx.drawImage(img, pos[i].x, pos[i].y, size, size);
        // নাম্বার ব্যাজ
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(pos[i].x + 10, pos[i].y + 10, 50, 50);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 35px Arial";
        ctx.fillText(i + 1, pos[i].x + 22, pos[i].y + 47);
    });
    await fs.writeFile(output, canvas.toBuffer());
                }
        
