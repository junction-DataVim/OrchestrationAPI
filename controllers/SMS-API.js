const fetch = require('node-fetch');

const send_alert = async (message, phoneNumber = "213540392348") => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App f0df42a9edf5dd92770e34d59171d477-7c4a981d-5407-41e7-a5a2-f1da88aa67fb");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
      "messages": [
        {
          "destinations": [{"to": phoneNumber}],
          "from": "447491163443",
          "text": message
        }
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch("https://api.infobip.com/sms/2/text/advanced", requestOptions);
    const result = await response.text();

    if (response.ok) {
      console.log('SMS Alert sent successfully:', result);
      return { success: true, result };
    } else {
      console.error('SMS Alert failed:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('Error sending SMS alert:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { send_alert };
