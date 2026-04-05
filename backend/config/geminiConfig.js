const { GoogleGenerativeAI } = require("@google/generative-ai");

const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    const client = new GoogleGenerativeAI(apiKey);
    return client;
  } catch (error) {
    console.error("Error initializing Gemini:", error.message);
    throw error;
  }
};

const getGeminiModel = (client) => {
  return client.getGenerativeModel({ model: "gemini-pro" });
};

module.exports = {
  initializeGemini,
  getGeminiModel,
};
