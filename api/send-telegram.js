// File: /api/send-telegram.js  (for Vercel)
// Or: /netlify/functions/send-telegram.js (for Netlify)

const fetch = require('node-fetch');

// This is the main function that will be executed
exports.handler = async function(event) {
    // We only accept POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Get the secrets from environment variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return { statusCode: 500, body: 'Bot configuration missing.' };
    }

    try {
        // Parse the form data from the request body
        const formData = JSON.parse(event.body);

        // Format the message nicely for Telegram
        let message = `🔔 *درخواست جدید از فرم دادبان الکترونیک*\n\n`;
        for (const [key, value] of Object.entries(formData)) {
            if (value) {
                // Replace underscores with spaces for better readability
                const formattedKey = key.replace(/_/g, ' ');
                message += `*${formattedKey}:*\n\`${value}\`\n\n`;
            }
        }

        // Telegram API URL
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // Create the request payload
        const payload = {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        };

        // Send the message to Telegram
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const telegramResponse = await response.json();

        if (!telegramResponse.ok) {
            // If Telegram returned an error
            throw new Error(telegramResponse.description);
        }

        // Return a success response to the form
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully!' })
        };

    } catch (error) {
        // Return an error response
        console.error('Error sending message:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send message.' })
        };
    }
};