export function removeFromArray(idx: number, arr: Float32Array): Float32Array {
    if (idx < 0 || idx >= arr.length) {
        throw new Error("Index out of bounds");
    }
    return new Float32Array([...arr.slice(0, idx), ...arr.slice(idx + 1)]);
}
