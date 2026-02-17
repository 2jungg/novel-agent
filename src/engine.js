import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { callAI } from './ai.js';

function validatePath(targetPath) {
    const root = process.cwd();
    const resolvedPath = path.resolve(targetPath);
    if (!resolvedPath.startsWith(root)) {
        throw new Error(`Security Violation: Access denied to path outside project root: ${resolvedPath}`);
    }
    return resolvedPath;
}

export async function initProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    validatePath(projectPath);

    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
        return;
    }

    const dirs = ['bible', 'characters', 'plot', 'manuscript', 'style'];
    for (const dir of dirs) {
        fs.ensureDirSync(path.join(projectPath, dir));
    }

    console.log(chalk.blue('\n✨ Generating 5 unique novel concepts using AI...'));
    
    const prompt = `Generate 5 highly creative and distinct web-novel concepts. 
    Each concept must include:
    1. Title
    2. Genre
    3. World-building Hook (The unique "Bible" setting)
    4. Protagonist (Personality & Special Trait)
    5. Core Conflict
    Format as JSON array: [{"title": "...", "genre": "...", "world": "...", "protagonist": "...", "conflict": "..."}]`;

    try {
        const response = await callAI(prompt, "You are a world-class web-novel editor and creative director.");
        // Clean markdown code blocks if AI returns them
        const cleanedResponse = response.replace(/```json|```/g, "").trim();
        const concepts = JSON.parse(cleanedResponse);

        const choices = concepts.map((c, i) => ({
            name: `${chalk.bold(c.title)} (${c.genre}) - ${c.world.substring(0, 60)}...`,
            value: i
        }));

        const { selection } = await inquirer.prompt([{
            type: 'list',
            name: 'selection',
            message: 'Select the concept that will be the seed of your legend:',
            choices: choices
        }]);

        const chosen = concepts[selection];
        
        // Deep World-Building Initialization
        const bible = {
            metadata: { title: chosen.title, genre: chosen.genre, createdAt: new Date().toISOString() },
            world: { setting: chosen.world, laws: "TBD", geography: "TBD" },
            protagonist: chosen.protagonist,
            plot_seed: chosen.conflict
        };

        fs.writeJsonSync(path.join(projectPath, 'bible', 'config.json'), bible, { spaces: 2 });
        
        // Create initial character sheet
        fs.writeJsonSync(path.join(projectPath, 'characters', 'protagonist.json'), {
            name: "TBD",
            traits: chosen.protagonist,
            arc: "From Zero to Hero"
        }, { spaces: 2 });

        console.log(chalk.green(`\n✅ Project "${projectName}" is ready! Step into the world of "${chosen.title}".`));
    } catch (e) {
        console.error(chalk.red("\n❌ Failed to connect to AI. Did you run 'novel auth'?"));
        console.error(e.message);
    }
}

export async function writeChapter(chapterNum, options) {
    const manuscriptDir = validatePath(path.join(process.cwd(), 'manuscript'));
    const biblePath = validatePath(path.join(process.cwd(), 'bible', 'config.json'));
    
    if (!fs.existsSync(biblePath)) {
        console.error(chalk.red('Error: Not in a novel project directory.'));
        return;
    }

    const bible = fs.readJsonSync(biblePath);
    const files = fs.readdirSync(manuscriptDir).filter(f => f.endsWith('.md'));
    let targetNum = chapterNum || (files.length + 1);
    const filePath = path.join(manuscriptDir, `chapter_${targetNum}.md`);

    if (fs.existsSync(filePath) && !options.edit) {
        console.error(chalk.red(`Error: Chapter ${targetNum} already exists.`));
        return;
    }

    console.log(chalk.yellow(`\n✍️ AI is drafting Chapter ${targetNum}...`));
    
    const context = `World: ${bible.world.setting}\nProtagonist: ${bible.protagonist}\nConflict: ${bible.plot_seed}`;
    const instruction = options.edit ? `Edit Chapter ${targetNum} based on: ${options.edit}` : `Write a new Chapter ${targetNum}.`;
    
    const prompt = `${context}\n\n${instruction}\n\nPlease provide the prose in Korean, maintaining a professional web-novel style.`;

    try {
        const prose = await callAI(prompt, "You are a best-selling web-novel author known for immersive prose.");
        fs.writeFileSync(filePath, prose);
        console.log(chalk.green(`\n✨ Chapter ${targetNum} has been written to ${filePath}`));
    } catch (e) {
        console.error(chalk.red("\n❌ Drafting failed. Check your API key or connection."));
    }
}

export async function critiqueChapter(chapterNum) { console.log("Critique logic..."); }
export async function exportNovel(format) { console.log("Export logic..."); }
export async function visualizeRelations() { console.log("Relations logic..."); }
