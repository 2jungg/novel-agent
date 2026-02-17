#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import Conf from 'conf';
import { setupAuth } from '../src/auth.js';
import { 
    initProject, 
    writeChapter, 
    critiqueChapter, 
    exportNovel, 
    visualizeRelations 
} from '../src/engine.js';

const config = new Conf({ projectName: 'novel-agent' });
const program = new Command();

program
  .name('novel')
  .description('AI Web-novel Agent CLI')
  .version('0.1.0');

program
  .command('auth')
  .description('Authenticate with AI providers (Google/OpenAI)')
  .action(async () => {
    console.log(chalk.blue('Starting OAuth authentication...'));
    await setupAuth();
  });

program
  .command('init <name>')
  .description('Initialize a new novel project with AI-generated concepts')
  .action(async (name) => {
    await initProject(name);
  });

program
  .command('change <request>')
  .description('Modify world-building or character settings via AI')
  .action(async (request) => {
    console.log(chalk.blue(`Requesting change: "${request}"...`));
    // Logic for surgical edits to bible/characters
  });

program
  .command('plan [message]')
  .description('Generate or update the main storyline/arc')
  .action(async (message) => {
    console.log(chalk.magenta('Planning the storyline...'));
  });

program
  .command('config')
  .description('Manage configuration (e.g., set default model)')
  .option('-m, --model <model>', 'Set default AI model')
  .action((options) => {
    if (options.model) {
      config.set('default_model', options.model);
      console.log(chalk.green(`Default model set to: ${options.model}`));
    } else {
      console.log(chalk.blue(`Current Model: ${config.get('default_model') || 'gemini-3-flash'}`));
    }
  });

program
  .command('write [number]')
  .description('Write a specific chapter')
  .option('-e, --edit [message]', 'Re-write or edit an existing chapter with specific instructions')
  .action(async (number, options) => {
    await writeChapter(number, options);
  });

program
  .command('critique <number>')
  .description('Get AI feedback on a specific chapter for consistency and quality')
  .action(async (number) => {
    await critiqueChapter(number);
  });

program
  .command('export [format]')
  .description('Export the entire novel (PDF, EPUB, or TXT)')
  .action(async (format) => {
    await exportNovel(format || 'txt');
  });

program
  .command('relations')
  .description('Visualize character relationships and status')
  .action(async () => {
    await visualizeRelations();
  });

program.parse();
