const { cmd, commands } = require('../leviano');
const config = require('../config');
const os = require('os');

// Helper function to format system uptime
function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    let str = "";
    if (d > 0) str += `${d}d `;
    if (h > 0) str += `${h}h `;
    if (m > 0) str += `${m}m `;
    str += `${s}s`;
    return str.trim();
}

// =================================================================
// 🏓 UPTIME / SPEED COMMAND
// =================================================================
cmd({
    pattern: "uptime",
    alias: ["speed", "ping"],
    desc: "Check bot latency, uptime, and system resources",
    category: "general",
    react: "🍒"
},
async(conn, mek, m, { from, reply, myquoted }) => {
    try {
        const start = Date.now();
        
        // 1. Waiting message
        const msg = await conn.sendMessage(from, { text: '*T E S T I N G....*' }, { quoted: myquoted || mek });
        
        const end = Date.now();
        const latency = end - start;
        
        // 2. Real system uptime & RAM calculation
        const uptimeString = formatUptime(process.uptime());
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        // 3. Formatted status message
        const pingMsg = `*LEVIANO UPTIME 🌝💋* ⚡\n\n*🍒 UPTIME :❯  ${uptimeString}*\n*🍒 LATENCY :❯  ${latency}ms*\n*🍒 RAM :❯ ${usedMem}MB / ${totalMem}MB*`;

        // 4. Edit message for visual effect
        await conn.sendMessage(from, { text: pingMsg, edit: msg.key });

    } catch (e) {
        console.error("UPTIME COMMAND ERROR:", e);
        reply("Error: " + e.message);
    }
});


// =================================================================
// 🍒 OWNER COMMAND (Contact Card)
// =================================================================
cmd({
    pattern: "owner",
    desc: "Contact the creator",
    category: "general",
    react: "🍒"
},
async(conn, mek, m, { from, myquoted }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER || "0";
        
        // Create vCard contact details
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      'FN:LevianoXd(Owner)\n' +
                      'ORG:LevianoXdCorp;\n' +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
                      'END:VCARD';

        await conn.sendMessage(from, {
            contacts: {
                displayName: 'LEVIANO-XD OWNER',
                contacts: [{ vcard }]
            }
        }, { quoted: myquoted || mek });
    } catch (e) {
        console.error("OWNER COMMAND ERROR:", e);
    }
});