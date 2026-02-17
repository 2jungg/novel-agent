import { GoogleGenerativeAI } from "@google/generative-ai";
import Conf from 'conf';
import chalk from 'chalk';

const config = new Conf({ projectName: 'novel-agent' });

export async function callAI(prompt, systemInstruction = "") {
    const apiKey = config.get('ai_token');
    if (!apiKey) {
        throw new Error("API Key not found. Please run 'novel auth' first.");
    }

    const modelName = config.get('default_model') || 'gemini-3-flash-preview';
    const finalModelName = modelName.startsWith('models/') ? modelName : `models/${modelName}`;
    
    // Switch to v1beta for Gemini 3.0 support
    const url = `https://generativelanguage.googleapis.com/v1beta/${finalModelName}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    };

    if (systemInstruction) {
        payload.system_instruction = { parts: [{ text: systemInstruction }] };
    }

    try {
        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.candidates && response.data.candidates[0].content) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response format from Gemini API");
        }
    } catch (error) {
        const errMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(chalk.red(`AI Call Failed (Direct REST): ${errMsg}`));
        throw new Error(errMsg);
    }
}
