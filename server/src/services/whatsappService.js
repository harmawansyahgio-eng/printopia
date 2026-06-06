const env = require('../config/env');

const sendWhatsAppMessage = async (target, message) => {
  if (!env.fonnteEnabled) {
    console.log('WhatsApp notification disabled. Mock sending to:', target);
    console.log('Message:', message);
    return;
  }

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': env.fonnteApiKey,
      },
      body: new URLSearchParams({
        target: target,
        message: message,
      })
    });

    const data = await response.json();
    if (!data.status) {
      console.error('Fonnte API error:', data.reason);
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
};

module.exports = {
  sendWhatsAppMessage
};
