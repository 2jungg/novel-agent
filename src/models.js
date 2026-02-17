import { GoogleGenerativeAI } from "@google/generative-ai";
import Conf from 'conf';
import chalk from 'chalk';

const config = new Conf({ projectName: 'novel-agent' });

export async function listAvailableModels() {
    const apiKey = config.get('ai_token');
    if (!apiKey) {
        console.error(chalk.red("API Key not found. Run 'novel auth' first."));
        return;
    }

    try {
        // The SDK doesn't expose a simple listModels, we use the REST endpoint logic via fetch or similar
        // For CLI utility, we'll provide a curated list of known working models for Gemini SDK v1
        const commonModels = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-1.0-pro"
        ];
        
        console.log(chalk.cyan("\n🤖 Available & Supported Models (Curated):"));
        commonModels.forEach(m => {
            const isDefault = (config.get('default_model') || 'gemini-1.5-flash') === m;
            console.log(`${isDefault ? chalk.green('→') : ' '} ${m} ${isDefault ? chalk.green('(current)') : ''}`);
        });
        console.log(chalk.dim("\nYou can set a model using: novel config -m <model-name>"));
    } catch (error) {
        console.error(chalk.red(`Failed to list models: ${error.message}`));
    }
}
