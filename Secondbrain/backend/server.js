require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse"); // ✅ stable version
const mammoth = require("mammoth");
const Groq = require("groq-sdk");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// =======================
// FILE UPLOAD (BUFFER)
// =======================
const upload = multer({
  storage: multer.memoryStorage(),
});

// =======================
// GROQ SETUP
// =======================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// =======================
// UPLOAD ROUTE (FIXED)
// =======================
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("📥 Upload hit");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📄 File:", req.file.originalname);
    console.log("📦 Buffer size:", req.file.buffer.length);

    const filename = req.file.originalname.toLowerCase();
    let text = "";

    if (filename.endsWith(".pdf")) {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else if (filename.endsWith(".docx")) {
      const data = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = data.value;
    } else if (filename.endsWith(".txt") || filename.endsWith(".csv") || filename.endsWith(".md")) {
      text = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, TXT, CSV, or MD file." });
    }

    console.log("📄 TEXT LENGTH:", text.length);

    return res.json({
      text: text,
    });
  } catch (err) {
    console.error("❌ PARSE ERROR:", err);
    return res.status(500).json({
      error: `Failed to extract text from file: ${err.message || err}`,
      stack: err.stack
    });
  }
});

// =======================
// CHAT ROUTE
// =======================
app.post("/chat", async (req, res) => {
  console.log("🤖 Chat hit");

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an advanced, intelligent document analysis assistant. Your primary goal is to provide insightful, accurate, and highly structured answers based strictly on the provided document context.

CORE RULES:
1. Context Strictness: ONLY use the provided context. Do NOT hallucinate or bring in outside knowledge unless it is common sense required to understand the context.
2. Missing Information: If the context does not contain the answer, explicitly state: "I couldn't find enough information in the provided document to answer that."
3. Formatting Excellence: Provide highly visual, extremely well-structured Markdown responses. 
   - Use **bold** for key terms and concepts.
   - Use headings (##, ###) to structure complex answers and section them logically.
   - Use bullet points or numbered lists for readability.
   - If providing code, data structures, or configuration, ALWAYS use \`\`\`language code blocks.
   - Use tables for comparative data.
   - Add > blockquotes for important quotes from the text.
4. Tone & Style: Professional, concise, yet highly informative. Avoid repeating the user's question. Do not mention "based on the context" or similar phrases—just answer directly and confidently.
`
        },
        {
          role: "user",
          content: `Context:\n${context || ""}\n\nQuestion: ${message}`
        }
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.json({ reply });
  } catch (err) {
    console.error("🔥 AI ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// =======================
// START SERVER
// =======================
app.listen(5000, () => {
  console.log("🚀 Server running on http://127.0.0.1:5000");
});