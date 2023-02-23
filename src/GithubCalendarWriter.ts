import { exec } from "@actions/exec";
import * as fs from "node:fs/promises";
import { uuid } from "uuidv4";
import { Font, Glyph } from "./types";

export default class GithubCalendarWriter {
  #font: Font;

  public constructor(font: Font) {
    this.#font = font;
  }

  /**
   * Check if a write is needed for the given text and date.
   * @param text
   * @param date
   */
  public shouldWrite(text: string, date: Date): boolean {
    const { x, y } = this.getPositionFromDate(date);

    const { glyph, relativeX, relativeY } = this.getClosestGlyph(text, x, y);
    const pixel = glyph.pixels.find(row => row[0] === relativeX && row[1] === relativeY);

    return pixel !== undefined;
  }

  /**
   * Writes to the GitHub calendar by committing to the repository.
   * @param text
   * @param date
   * @param commitCount
   * @param actorName
   * @param actorEmail
   */
  public async write(text: string, date: Date, commitCount: number, actorName: string, actorEmail: string): Promise<boolean> {
    if (!this.shouldWrite(text, date)) {
      console.log("No write needed today");
      return false;
    }

    try {
      await this.setupRepository(actorName, actorEmail);
      for (let i = 0; i < commitCount; i++) {
        await this.commitToRepository();
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Find the closest glyph from the given position.
   * @param text
   * @param x
   * @param y
   */
  public getClosestGlyph(text: string, x: number, y: number): { glyph: Glyph, relativeX: number, relativeY: number } {
    let closestGlyph = this.#font.glyphs.find(glyph => glyph.name === " ");
    x--;
    y--;

    let currentCharacterIndex = 0;
    while (x >= 0 && currentCharacterIndex < text.length) {
      const currentCharacter = text[currentCharacterIndex];
      const glyph = this.#font.glyphs.find(glyph => glyph.name === currentCharacter.toLowerCase());

      if (glyph === undefined) {
        throw new Error(`Could not find glyph for character ${currentCharacter}`);
      }

      x -= glyph.width;

      if (x >= 0) {
        x--;
        closestGlyph = this.#font.glyphs.find(glyph => glyph.name === " ");
        currentCharacterIndex++;
      } else {
        closestGlyph = glyph;
      }
    }

    return { glyph: closestGlyph, relativeX: x + closestGlyph.width, relativeY: y - 1 };
  }

  /**
   * Get the position of the given date on the GitHub contributions calendar.
   * TODO: Account for the first day of the year not being a Monday.
   * @param date
   */
  public getPositionFromDate(date: Date): { x: number, y: number } {
    const start = new Date(date.getFullYear(), 0, 0);
    const difference = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const timeInDay = 1000 * 60 * 60 * 24;
    const currentDayFromYear = Math.floor(difference / timeInDay);

    return {
      x: Math.floor(currentDayFromYear / 7),
      y: currentDayFromYear % 7
    };
  }

  /**
   * Setup the repository in which the commits will be made.
   * @param actorName
   * @param actorEmail
   * @param repository
   * @private
   */
  private async setupRepository(actorName: string, actorEmail: string, repository?: string) {
    if (repository) {
      // Clone the repository if it's not already cloned by the checkout action.
      await exec(`git clone ${repository}`);
    }

    await exec(`git config --global user.name ${actorName}`);
    await exec(`git config --global user.email ${actorEmail}`);
  }

  /**
   * Commit to the repository.
   * @private
   */
  private async commitToRepository() {
    await fs.writeFile("github_contributions_calendar_writer.txt", uuid(), { flag: "w" });
    await exec("git add github_contributions_calendar_writer.txt");
    await exec("git pull");
    await exec("git commit -m \"build: update github contributions calendar\"");
    await exec("git push origin -f");
  }
}
