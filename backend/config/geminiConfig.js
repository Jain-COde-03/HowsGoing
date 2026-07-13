const { GoogleGenerativeAI } = require("@google/generative-ai");

let cachedClient = null;

const initializeGemini = () => {
  try {
    if (cachedClient) return cachedClient;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const client = new GoogleGenerativeAI(apiKey);
    cachedClient = client;

    return client;
  } catch (error) {
    console.error("Error initializing Gemini:", error.message);
    throw error;
  }
};

const getGeminiModel = (client) => {
  return client.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    generationConfig: {
      maxOutputTokens: 10000,
    },
  });
};

module.exports = {
  initializeGemini,
  getGeminiModel,
};
