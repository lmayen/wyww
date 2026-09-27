import {ColorData} from "../models/data";

export interface HSV {
    h: number; // 0 - 360 (degrees)
    s: number; // 0 - 100 (percentage)
    v: number; // 0 - 100 (percentage)
}

export type GradientDirection =
    | 'to top'
    | 'to top right'
    | 'to right'
    | 'to bottom right'
    | 'to bottom'
    | 'to bottom left'
    | 'to left'
    | 'to top left'
    | `${number}deg`;

export interface BackgroundGradientOptions {
    direction: GradientDirection;

    from: string;
    to: string;

    fromAt?: string;
    toAt?: string;
}

export function buildGradient(gradient: BackgroundGradientOptions): string {
    return `linear-gradient(
        ${gradient.direction},
        ${gradient.from} ${gradient.fromAt ?? '0%'},
        ${gradient.to} ${gradient.toAt ?? '100%'}
    )`;
}

export function buildBackgroundImage(url: string): string {
    return `url("${url}")`;
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
    // Normalize RGB values to [0, 1]
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const v = max;

    // Calculate Saturation
    if (max !== 0) {
        s = delta / max;
    }

    // Calculate Hue
    if (delta !== 0) {
        if (max === rNorm) {
            h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        } else if (max === gNorm) {
            h = (bNorm - rNorm) / delta + 2;
        } else {
            h = (rNorm - gNorm) / delta + 4;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
    };
}

