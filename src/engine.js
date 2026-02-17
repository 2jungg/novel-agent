import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Conf from 'conf';

const config = new Conf({ projectName: 'novel-agent' });

export async function initProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    
    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
        return;
    }

    // 1. Create folders
    const dirs = ['bible', 'characters', 'plot', 'manuscript', 'style'];
    for (const dir of dirs) {
        fs.ensureDirSync(path.join(projectPath, dir));
    }

    console.log(chalk.blue('Consulting the Muse for concepts...'));

    // 2. Simulated AI Response (In production, call Google/OpenAI SDK here)
    const concepts = [
        { name: "Cyberpunk Joseon", desc: "A world where high-tech prosthetics meet traditional hanboks." },
        { name: "Alchemist's Debt", desc: "A mage must pay off a student loan by hunting rare monsters." },
        { name: "The Last Glitch", desc: "The NPC realized the world is a game and started deleting players." },
        { name: "Echoes of Silence", desc: "Music is the only weapon in a world invaded by sound-eating aliens." },
        { name: "Infinite Library", desc: "A librarian trapped in a tower containing every book ever written." }
    ];

    const choices = concepts.map((c, i) => ({
        name: `${i + 1}. [${c.name}] - ${c.desc}`,
        value: i
    }));

    const { selection } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'Which concept sparks your interest?',
            choices: choices
        }
    ]);

    const chosen = concepts[selection];
    
    // 3. Initialize Bible
    const bibleData = {
        title: chosen.name,
        concept: chosen.desc,
        createdAt: new Date().toISOString()
    };
    
    fs.writeJsonSync(path.join(projectPath, 'bible', 'config.json'), bibleData);
    console.log(chalk.green(`\nProject "${projectName}" initialized with "${chosen.name}"!`));
}

export async function writeChapter(chapterNum, options) {
    const manuscriptDir = path.join(process.cwd(), 'manuscript');
    if (!fs.existsSync(manuscriptDir)) {
        console.error(chalk.red('Error: Not in a novel project directory.'));
        return;
    }

    const files = fs.readdirSync(manuscriptDir).filter(f => f.endsWith('.md'));
    let targetNum = chapterNum;

    if (!targetNum) {
        targetNum = files.length + 1;
    }

    const fileName = `chapter_${targetNum}.md`;
    const filePath = path.join(manuscriptDir, fileName);

    if (fs.existsSync(filePath) && !options.edit) {
        console.error(chalk.red(`Error: Chapter ${targetNum} already exists. Use --edit to overwrite.`));
        return;
    }

    console.log(chalk.yellow(`${options.edit ? 'Editing' : 'Writing'} Chapter ${targetNum}...`));
    // Call AI to write prose...
}
