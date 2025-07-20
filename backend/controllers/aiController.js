const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc Generate interview questions and answers using Gemini
// @route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        message: "Gemini API did not return any content.",
      });
    }

    // 🧼 Remove markdown formatting like ```json
    let cleanedText = rawText
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    // 🧠 Optional debug log:
    // console.log("🔍 Cleaned AI Response:\n", cleanedText);

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError.message);
      return res.status(500).json({
        message: "Invalid JSON returned from Gemini",
        raw: cleanedText, // Optional: send back for inspection
      });
    }

    if (!Array.isArray(data)) {
      return res.status(500).json({
        message: "AI response is not a valid array of questions.",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("🔥 Gemini AI Error:", error);
    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};



// @desc Generate explanation for a concept/question
// @route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required field: question" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
