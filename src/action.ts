import * as core from '@actions/core';
import main from './main';

const text = core.getInput('text');
const font = core.getInput('font');
const simulate = core.getInput('simulate') === 'true';
const actorName = core.getInput('actorName');
const actorEmail = core.getInput('actorEmail');
const commitCount = core.getInput('commitCount');

await main(text, actorName, actorEmail, font, simulate, commitCount);
