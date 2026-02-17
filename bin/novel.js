#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { setupAuth } from '../src/auth.js';

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
  .command('init')
  .description('Initialize a new novel project')
  .action(() => {
    console.log(chalk.green('Initializing new novel project...'));
  });

program
  .command('write')
  .description('Start the TUI writing dashboard')
  .option('-c, --chapter <number>', 'Chapter number to write')
  .action((options) => {
    console.log(chalk.yellow(`Launching TUI for chapter ${options.chapter || 'next'}...`));
    // Here we would spawn the Python TUI or a Node-based TUI
  });

program.parse();
