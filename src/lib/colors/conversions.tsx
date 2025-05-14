interface ColorRGB {
    r: number;
    g: number;
    b: number;
}

export function HSLtoRGB(H: number, S: number, L: number): ColorRGB {
    L = Math.pow(L, 2.2); // Gamma correct L
    const C = (1 - Math.abs(2 * L - 1)) * S;
    const Hprime = (H % 360.0) / 60.0;
    const X = C * (1 - Math.abs((Hprime % 2) - 1));
    const m = L - C / 2.0;

    let colorRGB = { r: 0.0, g: 0.0, b: 0.0 };
    if (Hprime >= 0 && Hprime < 1) {
        colorRGB = { r: C, g: X, b: 0.0 };
    } else if (Hprime >= 1 && Hprime < 2) {
        colorRGB = { r: X, g: C, b: 0.0 };
    } else if (Hprime >= 2 && Hprime < 3) {
        colorRGB = { r: 0.0, g: C, b: X };
    } else if (Hprime >= 3 && Hprime < 4) {
        colorRGB = { r: 0.0, g: X, b: C };
    } else if (Hprime >= 4 && Hprime < 5) {
        colorRGB = { r: X, g: 0.0, b: C };
    } else if (Hprime >= 5 && Hprime < 6) {
        colorRGB = { r: C, g: 0.0, b: X };
    }

    return { r: colorRGB.r + m, g: colorRGB.g + m, b: colorRGB.b + m };
}
