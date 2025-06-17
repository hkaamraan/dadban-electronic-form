// File: /api/send-telegram.js (Final, Robust Version)

export default async function handler(req, res) {
    // 1. We only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // 2. Get secrets from Environment Variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // 3. Check if secrets are set
    if (!BOT_TOKEN || !CHAT_ID) {
        console.error("Server Error: Missing Telegram environment variables");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        // 4. Get form data from the request body
        const formData = req.body;

        // 5. Format a nice message
        let message = `🔔 *درخواست جدید از فرم دادبان الکترونیک*\n\n`;
        for (const key in formData) {
            if (formData[key]) {
                const formattedKey = key.replace(/_/g, ' ');
                message += `*${formattedKey}:*\n\`${formData[key].toString()}\`\n\n`;
            }
        }

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // 6. Send the data to the Telegram API
        const telegramResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await telegramResponse.json();

        // 7. Check if Telegram accepted the message
        if (!result.ok) {
            console.error("Telegram API Error:", result.description);
            throw new Error(result.description);
        }

        // 8. Send a success response back to the form
        return res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Internal Function Error:', error.message);
        return res.status(500).json({ message: 'Failed to send message.' });
    }
}