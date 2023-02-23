import test from 'node:test';
import assert from 'node:assert';
import GithubCalendarWriter from '../src/GithubCalendarWriter';
import font from '../fonts/default.json' assert { type: 'json' };
import { Font } from '../src/types';

const githubCalendarWriter = new GithubCalendarWriter(font as Font);

test('Closest glyph', (t) => {
    test('Spacing', (t) => {
        assert.strictEqual(githubCalendarWriter.getClosestGlyph('Hello world', 0, 2).glyph.name, ' ');
        assert.strictEqual(githubCalendarWriter.getClosestGlyph('Hello world', 4, 2).glyph.name, ' ');
    });

    test('Letters', (t) => {
        assert.strictEqual(githubCalendarWriter.getClosestGlyph('Hello world', 2, 2).glyph.name, 'h');
        assert.strictEqual(githubCalendarWriter.getClosestGlyph('Hello world', 1, 1).glyph.name, 'h');
        assert.strictEqual(githubCalendarWriter.getClosestGlyph('Hello world', 5, 2).glyph.name, 'e');
    });
});
