export function getRandomFloat(min: number, max: number): number {
    // At some point, I'm going to want to replace this with a seedable random number generator.
    // For now, I'll lazily use Math.random().
    return Math.random() * (max - min) + min;
}
