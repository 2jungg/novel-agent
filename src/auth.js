import open from 'open';
import express from 'express';
import Conf from 'conf';
import chalk from 'chalk';
import inquirer from 'inquirer';

const config = new Conf({ projectName: 'novel-agent' });

export async function setupAuth() {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Choose authentication method:',
      choices: [
        { name: 'Enter API Key manually (Recommended for now)', value: 'manual' },
        { name: 'Browser OAuth (Google)', value: 'oauth' }
      ]
    }
  ]);

  if (method === 'manual') {
    const { key } = await inquirer.prompt([
      {
        type: 'password',
        name: 'key',
        message: 'Enter your Gemini API Key:'
      }
    ]);
    config.set('ai_token', key);
    console.log(chalk.green('\nAPI Key saved successfully!'));
  } else {
    // Basic Express server for OAuth callback
    const app = express();
    const port = 3847;
    const server = app.listen(port, () => {
      console.log(chalk.yellow(`\nVisit: https://aistudio.google.com/app/apikey (Get key here)`));
      console.log(chalk.cyan(`Listening for callback on http://localhost:${port}/callback`));
    });

    app.get('/callback', (req, res) => {
      const { token } = req.query;
      if (token) {
        config.set('ai_token', token);
        res.send('Auth success!');
        server.close();
      }
    });
  }
}
