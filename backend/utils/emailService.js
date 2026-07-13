const axios = require("axios");

const sendWelcomeEmail = async (user) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.BREVO_EMAIL,
          name: "HowsGoing?",
        },
        to: [
          {
            email: user.email,
            name: user.name,
          },
        ],
        subject: "Welcome 🎉",
        htmlContent: `
          <html>
            <body>
              <h1>Welcome ${user.name} 🎉</h1>
              <p>Your account has been created successfully.</p>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Email sent via API");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Email error:", error.response?.data || error.message);
  }
};

module.exports = { sendWelcomeEmail };
