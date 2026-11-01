const { cmd } = require('../leviano')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp",
    alias: ["attptext", "textsticker", "namesticker", "stickername", "at", "att", "atp"],
    react: "✨",
    desc: "Convert text into animated sticker",
    category: "sticker",
    use: ".attp <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
                "*🥺 DO YOU WANT TO MAKE A STICKER OF YOUR NAME?*\n\n" +
                "*Use:* `.attp LEVIANO`\n\n" +
                "*Example:*\n.attp leviano"
            )
        }

        reply("*✨ YOUR STICKER IS BEING CREATED*\n*PLEASE WAIT A MOMENT...☺️*")

        const text = encodeURIComponent(args.join(" "))
        const gifBuffer = await fetchGif(
            `https://api-fix.onrender.com/api/maker/attp?text=${text}`
        )

        // Passing packname and author options to gifToSticker
        const sticker = await gifToSticker(gifBuffer, {
            packname: "⌁𝗺𝗼𝗻𝗷𝗮𝗻⋆𝗻𝗶𝗰𝗸↲ ㅫ",
            author: "➥❮🍿☆ ₇₉͒₀₇₉⃕₉₇₅₃͒₇ ☆🍯❯"
        })

        await conn.sendMessage(
            m.chat,
            { sticker },
            { quoted: mek }
        )

    } catch (e) {
        console.log("ATTP ERROR:", e)
        reply("*❌ AN ERROR OCCURRED WHILE MAKING THE STICKER 🥺*")
    }
})