const { cmd } = require('../leviano')

cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    react: "🍒",
    desc: "Retrieve view-once media (Owner only)",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("*THIS COMMAND IS ONLY FOR THE BOT OWNER 😊*")

        if (!m.quoted)
            return reply(
                "*🥺 REPLY TO ANY VIEW-ONCE PHOTO / VIDEO / AUDIO*\n\n" +
                "*Then write:* `.vv`\n\n" +
                "*Then enjoy with Leviano 🍒*"
            )

        // 🔥 VIEW ONCE FIX
        let quoted = m.quoted
        let msg = quoted.message

        if (msg?.viewOnceMessageV2) {
            msg = msg.viewOnceMessageV2.message
        } else if (msg?.viewOnceMessageV2Extension) {
            msg = msg.viewOnceMessageV2Extension.message
        }

        const type = Object.keys(msg)[0]
        const buffer = await quoted.download()

        let content = {}
        const header = `▸▸▸▸▸ ʟᴇᴠɪᴀɴᴏ X xᴅ ◂◂◂◂◂\n  ╰─► ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴇᴠɪᴀɴᴏ ꜱᴇʀ\n\n`;

        if (type === "imageMessage") {
            content = {
                image: buffer,
                caption: header + (quoted.text || "")
            }
        } 
        else if (type === "videoMessage") {
            content = {
                video: buffer,
                caption: header + (quoted.text || "")
            }
        } 
        else if (type === "audioMessage") {
            content = {
                audio: buffer,
                mimetype: "audio/mp4",
                ptt: false
            }
            // Send header text first for audio since caption is not supported on audio messages
            await conn.sendMessage(from, { text: header }, { quoted: mek });
        } 
        else {
            return reply("*❌ THIS VIEW-ONCE MEDIA TYPE IS NOT SUPPORTED 🥺*")
        }

        await conn.sendMessage(from, content, { quoted: mek })

    } catch (e) {
        console.log("VV ERROR:", e)
        reply("*❌ AN ERROR OCCURRED WHILE OPENING VIEW-ONCE MEDIA 🥺*")
    }
})