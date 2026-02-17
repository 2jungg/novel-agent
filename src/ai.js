import { GoogleGenerativeAI } from "@google/generative-ai";
import Conf from 'conf';
import chalk from 'chalk';

const config = new Conf({ projectName: 'novel-agent' });

export async function callAI(prompt, systemInstruction = "") {
    const apiKey = config.get('ai_token');
    if (!apiKey) {
        throw new Error("API Key not found. Please run 'novel auth' first.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = config.get('default_model') || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction 
    });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(chalk.red(`AI Call Failed: ${error.message}`));
        throw error;
    }
}
