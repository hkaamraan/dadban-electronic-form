// File: /api/send-telegram.js (Final Version with new Brand Name)

export default async function handler(req, res) {
    // 1. We only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // 2. Get secrets from Environment Variables
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    // 3. Check if secrets are set
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Server Error: Missing Telegram environment variables");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        // 4. Get form data from the request body
        const formData = req.body;
        
        // 5. Translation map for user-friendly values
        const translations = {
            'individual': 'شخص حقیقی',
            'lawyer': 'وکیل / دفتر حقوقی'
        };
        
        // 6. Format a nice message with the NEW brand name
        // This is the line that has been updated
        let message = `🔔 *درخواست جدید از فرم دادرس الکترونیک*\n\n`;
        
        for (const key in formData) {
            if (formData[key]) {
                const formattedKey = key.replace(/_/g, ' ');
                let displayValue = formData[key];

                // Translate 'clientType' value if it exists in our map
                if (key === 'نوع متقاضی') {
                    displayValue = translations[displayValue] || displayValue;
                }
                
                message += `*${formattedKey}:*\n\`${displayValue}\`\n\n`;
            }
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        // 7. Send the data to the Telegram API
        const telegramResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await telegramResponse.json();

        // 8. Check if Telegram accepted the message
        if (!result.ok) {
            console.error("Telegram API Error:", result.description);
            throw new Error(result.description);
        }

        // 9. Send a success response back to the form
        return res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Internal Function Error:', error.message);
        return res.status(500).json({ message: 'Failed to send message.' });
    }
}