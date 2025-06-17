// File: /api/send-telegram.js (Final Version with value translation)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        const formData = req.body;

        // --- NEW: Translation map and cleaner message logic ---
        const translations = {
            'individual': 'شخص حقیقی',
            'lawyer': 'وکیل / دفتر حقوقی',
            'layeheh': 'تنظیم اوراق قضایی',
            'tahlil': 'تحلیل و تفسیر حکم',
            'transcribe': 'تبدیل صوت به متن',
            'content': 'تولید محتوای حقوقی'
        };

        // Replace service values with their Persian translations
        if (formData['خدمت']) {
            const serviceValues = formData['خدمت'].split('، ');
            const translatedServices = serviceValues.map(s => translations[s] || s);
            formData['خدمت'] = translatedServices.join('، ');
        }
        
        let message = `🔔 *درخواست جدید از فرم دادبان الکترونیک*\n\n`;
        
        for (const key in formData) {
            // Exclude agreement checkboxes from the message
            if (key.startsWith('پذیرش_')) continue;

            if (formData[key]) {
                const formattedKey = key.replace(/_/g, ' ');
                let displayValue = formData[key];

                // Translate 'clientType' value
                if (key === 'نوع متقاضی') {
                    displayValue = translations[displayValue] || displayValue;
                }
                
                message += `*${formattedKey}:*\n\`${displayValue}\`\n\n`;
            }
        }
        // --- END OF NEW LOGIC ---

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