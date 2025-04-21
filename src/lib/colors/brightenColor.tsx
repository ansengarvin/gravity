export function brightenColor(color: string, factor: number): string {
    // Extract RGB values from the string "rgb(r, g, b)"
    const [r, g, b] = color
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((value) => parseInt(value.trim()));

    // Brighten each component by the factor, ensuring it doesn't exceed 255
    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    // Return the new RGB color string
    return `rgb(${newR}, ${newG}, ${newB})`;
}