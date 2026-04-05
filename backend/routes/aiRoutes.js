const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getOrCreateAIChat,
  sendAIMessage,
  summarizeMessages,
  generateAIResponse,
} = require("../controllers/aiControllers");

const router = express.Router();

router.route("/chat").get(protect, getOrCreateAIChat);
router.route("/message").post(protect, sendAIMessage);
router.route("/summarize").post(protect, summarizeMessages);
router.route("/response").post(protect, generateAIResponse);

module.exports = router;
