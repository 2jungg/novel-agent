import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Conf from 'conf';

const config = new Conf({ projectName: 'novel-agent' });

/**
 * Security Sandbox: Ensures all file operations are restricted 
 * to the project directory or the current working directory.
 */
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
    
    // Safety check: ensure we're not trying to escape via ../
    validatePath(projectPath);
    
    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
        return;
    }

    // 1. Create folders
    const dirs = ['bible', 'characters', 'plot', 'manuscript', 'style'];
    for (const dir of dirs) {
        const dirPath = validatePath(path.join(projectPath, dir));
        fs.ensureDirSync(dirPath);
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
    
    const biblePath = validatePath(path.join(projectPath, 'bible', 'config.json'));
    fs.writeJsonSync(biblePath, bibleData);
    console.log(chalk.green(`\nProject "${projectName}" initialized with "${chosen.name}"!`));
}

export async function writeChapter(chapterNum, options) {
    const manuscriptDir = validatePath(path.join(process.cwd(), 'manuscript'));
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
    const filePath = validatePath(path.join(manuscriptDir, fileName));

    if (fs.existsSync(filePath)) {
        if (!options.edit) {
            console.error(chalk.red(`Error: Chapter ${targetNum} already exists. Use --edit to overwrite.`));
            return;
        }
        
        const editInstructions = typeof options.edit === 'string' ? options.edit : 'General improvement';
        console.log(chalk.cyan(`Targeting existing Chapter ${targetNum} for edit...`));
        console.log(chalk.italic(`Instructions: "${editInstructions}"`));
    } else {
        if (options.edit) {
            console.error(chalk.red(`Error: Chapter ${targetNum} does not exist. You cannot edit a non-existent chapter.`));
            return;
        }
        console.log(chalk.yellow(`Writing brand new Chapter ${targetNum}...`));
    }
}

export async function critiqueChapter(chapterNum) {
    try {
        const manuscriptPath = validatePath(path.join(process.cwd(), 'manuscript', `chapter_${chapterNum}.md`));
        if (!fs.existsSync(manuscriptPath)) {
            console.error(chalk.red(`Error: Chapter ${chapterNum} not found.`));
            return;
        }
        console.log(chalk.magenta(`🔍 Critiquing Chapter ${chapterNum}...`));
        console.log(chalk.dim('Checking for lore consistency, pacing, and tone...'));
    } catch (e) {
        console.error(chalk.red(e.message));
    }
}

export async function exportNovel(format) {
    try {
        console.log(chalk.cyan(`📦 Exporting novel as ${format.toUpperCase()}...`));
        const manuscriptDir = validatePath(path.join(process.cwd(), 'manuscript'));
        const files = fs.readdirSync(manuscriptDir)
            .filter(f => f.endsWith('.md'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/) || 0);
                const numB = parseInt(b.match(/\d+/) || 0);
                return numA - numB;
            });

        if (files.length === 0) {
            console.error(chalk.red('Error: No chapters to export.'));
            return;
        }

        let fullText = '';
        for (const file of files) {
            const content = fs.readFileSync(path.join(manuscriptDir, file), 'utf8');
            fullText += `\n\n# ${file.replace('.md', '').toUpperCase()}\n\n${content}`;
        }

        const outputPath = validatePath(path.join(process.cwd(), `novel_export.${format}`));
        fs.writeFileSync(outputPath, fullText);
        console.log(chalk.green(`\nSuccess! Novel exported to: ${outputPath}`));
    } catch (e) {
        console.error(chalk.red(e.message));
    }
}

export async function visualizeRelations() {
    try {
        console.log(chalk.yellow('\n👥 [ Character Relationship Map ]'));
        const charDir = validatePath(path.join(process.cwd(), 'characters'));
        if (!fs.existsSync(charDir)) {
            console.error(chalk.red('Error: Character directory not found.'));
            return;
        }
        const characters = fs.readdirSync(charDir).filter(f => f.endsWith('.json'));
        if (characters.length === 0) {
            console.log(chalk.dim('No characters defined yet.'));
            return;
        }
        console.log(chalk.white('------------------------------------------'));
        for (const charFile of characters) {
            const charData = fs.readJsonSync(path.join(charDir, charFile));
            console.log(`${chalk.bold(charData.name || charFile)}: ${charData.role || 'Unknown'}`);
        }
        console.log(chalk.white('------------------------------------------'));
    } catch (e) {
        console.error(chalk.red(e.message));
    }
}
