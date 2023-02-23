export type Glyph = {
    name: string;
    width: number;
    pixels: number[][];
};

export type Font = {
    name: string;
    height: number;
    glyphs: Glyph[];
}
