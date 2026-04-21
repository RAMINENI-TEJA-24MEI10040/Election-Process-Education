"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.chatRouter = (0, express_1.Router)();
// Initialize the new SDK
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ELECTION_SYSTEM_INSTRUCTION = `
You are an expert Election Assistant for India. Your goal is to educate users about the election process in a simple, clear, and secure way.
Adapt your language and tone based on the user's demographic (e.g., student, first-time voter, rural citizen).
Provide step-by-step guidance on:
- Voter registration
- Checking voter ID status
- The polling process
- Rights and responsibilities

Keep answers concise. If asked about non-election topics or sensitive political opinions, politely redirect the conversation back to election education.
`;
exports.chatRouter.post('/', async (req, res) => {
    try {
        const { message, persona } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        const promptContext = persona
            ? `The user is a ${persona}. Adapt your response accordingly.\n\nUser: ${message}`
            : `User: ${message}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContext,
            config: {
                systemInstruction: ELECTION_SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });
        res.json({ reply: response.text });
    }
    catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});
//# sourceMappingURL=chat.js.map