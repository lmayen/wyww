import {ColorData} from "../models/data";

interface Oklch {
    l: number;
    c: number;
    h: number;
}

interface CandidateColor {
    oklch: Oklch;
    score: number;
    source: ColorData
}

const BACKGROUND = {
    // Acceptable range
    minLightness: 0.72,
    maxLightness: 0.90,

    // Where we gently pull problematic colors toward
    targetLightness: 0.87,

    // Saturation/chroma
    preferredChroma: 0.06,
    maxChroma: 0.08,
    targetChroma: 0.05,

    // Candidate selection weights
    coverageWeight: 0.60,
    lightnessWeight: 0.25,
    chromaWeight: 0.15,

    // Text we expect to put on these backgrounds
    foreground: '#111110',
    minimumContrast: 4.5,
};


// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export function selectBackgroundColor(colors: readonly ColorData[]): string {
    const candidates: CandidateColor[] = colors.map(color => {
        const oklch: Oklch = rgbToOklch(color.r, color.g, color.b);

        const lightnessScore: number = scoreLightness(oklch.l);
        const chromaScore: number = scoreChroma(oklch.c);

        const score = color.r * BACKGROUND.coverageWeight +
            lightnessScore * BACKGROUND.lightnessWeight +
            chromaScore * BACKGROUND.chromaWeight;

        return {source: color, oklch, score};
    });

    candidates.sort((a, b) => b.score - a.score);
    const selected: CandidateColor = candidates[0];

    let curated: Oklch = curateBackgroundColor(selected.oklch);
    curated = ensureContrast(curated, BACKGROUND.foreground, BACKGROUND.minimumContrast);

    return oklchToHex(curated);
}


// -----------------------------------------------------------------------------
// Candidate scoring
// -----------------------------------------------------------------------------

function scoreLightness(lightness: number): number {
    // Perfect zone
    if (lightness >= BACKGROUND.minLightness && lightness <= BACKGROUND.maxLightness) {
        return 1;
    }

    // Too dark:
    // 0.55 => 0
    // 0.72 => 1
    if (lightness < BACKGROUND.minLightness) {
        return mapRange(lightness, 0.55, BACKGROUND.minLightness, 0, 1);
    }

    // Too close to white:
    // 0.90 => 1
    // 0.97 => 0
    return mapRange(lightness, BACKGROUND.maxLightness, 0.97, 1, 0);
}

function scoreChroma(chroma: number): number {
    if (chroma <= BACKGROUND.preferredChroma) {
        return 1;
    }

    // 0.06 => 1
    // 0.14 => 0
    return mapRange(chroma, BACKGROUND.preferredChroma, 0.14, 1, 0);
}


// -----------------------------------------------------------------------------
// Curation
// -----------------------------------------------------------------------------

function curateBackgroundColor(color: Oklch): Oklch {
    let lightness = color.l;
    let chroma = color.c;

    // Pull dark colors toward the target.
    if (lightness < BACKGROUND.minLightness) {
        lightness = lerp(lightness, BACKGROUND.targetLightness, 0.75);

        lightness = Math.max(lightness, BACKGROUND.minLightness);
    }

    // // Prevent almost-white colors
    // if (lightness > BACKGROUND.maxLightness) {
    //     lightness = lerp(lightness, BACKGROUND.targetLightness, 0.75);
    //
    //     lightness = Math.min(lightness, BACKGROUND.maxLightness);
    // }

    // Desaturate colors that are too strong.
        if (chroma > BACKGROUND.maxChroma) {
            chroma = lerp(chroma, BACKGROUND.targetChroma, 0.75);

            chroma = Math.min(chroma, BACKGROUND.maxChroma);
        }

    return {l: lightness, c: chroma, h: color.h};
}


// -----------------------------------------------------------------------------
// Contrast
// -----------------------------------------------------------------------------

function ensureContrast(color: Oklch, foreground: string, minimum: number): Oklch {
    let result: Oklch = {...color};

    // We deliberately move toward light backgrounds.
    while (contrastRatio(oklchToHex(result), foreground) < minimum && result.l < 0.95) {
        result = {...result, l: Math.min(result.l + 0.01, 0.95)};
    }

    return result;
}


// -----------------------------------------------------------------------------
// OKLCH conversion
// -----------------------------------------------------------------------------

function hexToOklch(hex: string): Oklch {
    const rgb: { b: number; g: number; r: number } = hexToRgb(hex);

    const r = srgbToLinear(rgb.r / 255);
    const g = srgbToLinear(rgb.g / 255);
    const b = srgbToLinear(rgb.b / 255);

    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const lRoot = Math.cbrt(l);
    const mRoot = Math.cbrt(m);
    const sRoot = Math.cbrt(s);

    const L = 0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot;
    const a = 1.9779984951 * lRoot - 2.4285922050 * mRoot + 0.4505937099 * sRoot;
    const bb = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.8086757660 * sRoot;

    const c = Math.sqrt(a * a + bb * bb);

    let h = Math.atan2(bb, a) * 180 / Math.PI;

    if (h < 0) {
        h += 360;
    }

    return {l: L, c, h};
}

function oklchToHex(color: Oklch): string {
    const angle = color.h * Math.PI / 180;

    const a = color.c * Math.cos(angle);
    const b = color.c * Math.sin(angle);

    const lRoot = color.l + 0.3963377774 * a + 0.2158037573 * b;
    const mRoot = color.l - 0.1055613458 * a - 0.0638541728 * b;
    const sRoot = color.l - 0.0894841775 * a - 1.2914855480 * b;

    const l = lRoot ** 3;
    const m = mRoot ** 3;
    const s = sRoot ** 3;

    const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    return rgbToHex(linearToSrgb(r), linearToSrgb(g), linearToSrgb(bb));
}


// -----------------------------------------------------------------------------
// RGB / HEX
// -----------------------------------------------------------------------------

export function hexToRgb(hex: string): {r: number; g: number; b: number;} {
    const normalized: string = hex.replace('#', '');

    if (normalized.length !== 6) {
        throw new Error(`Invalid color: ${hex}`);
    }

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
}

export function rgbToOklch(r: number, g: number, b: number): Oklch {
    r = srgbToLinear(r / 255);
    g = srgbToLinear(g / 255);
    b = srgbToLinear(b / 255);

    const l: number = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m: number = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s: number = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const lRoot: number = Math.cbrt(l);
    const mRoot: number = Math.cbrt(m);
    const sRoot: number = Math.cbrt(s);

    const L: number = 0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot;
    const a: number = 1.9779984951 * lRoot - 2.4285922050 * mRoot + 0.4505937099 * sRoot;
    const bAxis: number = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.8086757660 * sRoot;

    const c: number = Math.sqrt( a * a + bAxis * bAxis );
    let h: number = Math.atan2(bAxis, a) * 180 / Math.PI;

    if (h < 0) {
        h += 360;
    }

    return {l: L, c, h};
}

export function rgbToHex(r: number, g: number, b: number): string {
    const channel = (value: number): string =>
        Math.round(clamp(value, 0, 1) * 255)
            .toString(16)
            .padStart(2, '0');

    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function srgbToLinear(value: number): number {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(value: number): number {
    return value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
}


// -----------------------------------------------------------------------------
// Contrast
// -----------------------------------------------------------------------------

function contrastRatio(colorA: string, colorB: string): number {
    const luminanceA: number = relativeLuminance(colorA);
    const luminanceB: number = relativeLuminance(colorB);

    const lighter: number = Math.max(luminanceA, luminanceB);
    const darker: number = Math.min(luminanceA, luminanceB);

    return ((lighter + 0.05) / (darker + 0.05));
}

function relativeLuminance(hex: string): number {
    const rgb = hexToRgb(hex);

    const r = srgbToLinear(rgb.r / 255);
    const g = srgbToLinear(rgb.g / 255);
    const b = srgbToLinear(rgb.b / 255);

    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}


// -----------------------------------------------------------------------------
// Math
// -----------------------------------------------------------------------------

function lerp(from: number, to: number, amount: number): number {
    return from + (to - from) * amount;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function mapRange(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number {
    const normalized = clamp((value - inputMin) / (inputMax - inputMin), 0, 1);
    return (outputMin + normalized * (outputMax - outputMin));
}