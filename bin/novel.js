#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { setupAuth } from '../src/auth.js';

const program = new Command();

program
  .name('novel')
  .description('AI Web-novel Agent CLI')
  .version('0.1.0');

import { setupAuth } from '../src/auth.js';
import { initProject, writeChapter } from '../src/engine.js';

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
  .command('write [number]')
  .description('Write a specific chapter')
  .option('-e, --edit', 'Re-write or edit an existing chapter')
  .action(async (number, options) => {
    await writeChapter(number, options);
  });

program.parse();
