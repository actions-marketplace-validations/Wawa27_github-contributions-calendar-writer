import fs from 'fs';
import { Font } from './types';
import GithubCalendarWriter from './GithubCalendarWriter';

const simulateYear = (githubCalendarWriter: GithubCalendarWriter, text: string) => {
    const calendar = [];
    const date = new Date(2022, 0, 1);
    for (let i = 0; i < 53; i++) {
        calendar.push([]);
        for (let j = 0; j < 7; j++) {
            if (githubCalendarWriter.shouldWrite(text, date)) {
                calendar[i].push('■');
            } else {
                calendar[i].push('□');
            }
            date.setDate(date.getDate() + 1);
        }
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 53; j++) {
            process.stdout.write(`${calendar[j][i]} `);
        }
        process.stdout.write('\n');
    }
}

const main = async (text: string, actorName: string, actorEmail: string, fontName?: string, simulate?: boolean, commitCount?: string): Promise<void> => {
    fontName = fontName?.length > 0 ? fontName : 'default.json';
    commitCount = commitCount?.length > 0 ? commitCount : '20';
    const font = JSON.parse(fs.readFileSync(`${process.cwd()}/fonts/${fontName ?? 'default.json'}`, 'utf-8')) as Font;

    const githubCalendarWriter = new GithubCalendarWriter(font);

    if (simulate) {
        simulateYear(githubCalendarWriter, text);
    } else {
        try {
            if (await githubCalendarWriter.write(text, new Date(), Number(commitCount), actorName, actorEmail)) {
                console.log('Successfully wrote to the GitHub contributions calendar');
            } else {
                console.log('No write was made to the GitHub contributions calendar');
            }
        } catch (e) {
            console.error(e);
        }
    }
};

export default main;
