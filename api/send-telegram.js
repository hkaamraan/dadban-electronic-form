export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Server Error: Missing Telegram environment variables");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        const formData = req.body;
        
        const translations = {
            'individual': 'شخص حقیقی',
            'lawyer': 'وکیل / دفتر حقوقی'
        };
        
        let message = `🔔 *درخواست جدید از فرم دادبان الکترونیک*\n\n`;
        
        for (const key in formData) {
            if (formData[key]) {
                const formattedKey = key.replace(/_/g, ' ');
                let displayValue = formData[key];

                if (key === 'نوع متقاضی') {
                    displayValue = translations[displayValue] || displayValue;
                }
                
                message += `*${formattedKey}:*\n\`${displayValue}\`\n\n`;
            }
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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

        if (!result.ok) {
            throw new Error(result.description);
        }

        return res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Internal Function Error:', error.message);
        return res.status(500).json({ message: 'Failed to send message.' });
    }
}