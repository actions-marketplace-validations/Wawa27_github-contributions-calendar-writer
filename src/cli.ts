import { program } from 'commander';
import { version } from '../package.json' assert { type: 'json' };
import main from './main';

const start = async (text: string, actorName: string, actorEmail: string) => {
    const { font, simulate } = program.opts();

    await main(text, actorName, actorEmail, font, simulate);
};

program
    .version(version)
    .argument('<text>', 'The text to write to the GitHub contributions calendar')
    .argument('<actorName>', 'The name of the actor to use for the commits')
    .argument('<actorEmail>', 'The email of the actor to use for the commits')
    .option('-f, --font <font>', 'The font name to use, the font should be located in the fonts folder, defaults to "default.json"', 'default.json')
    .option('-c, --commit-count <commitCount>', 'The number of commits to make, defaults to 100', '20')
    .option('--token <token>', 'The GitHub token to use', process.env.GITHUB_TOKEN)
    .option('--repository <repository>', 'The GitHub repository to use', process.env.GITHUB_REPOSITORY)
    .option('--simulate', 'Simulate the write to the GitHub contributions calendar', false)
    .action(start);

program.parse();
