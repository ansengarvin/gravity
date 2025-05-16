import { vec3 } from "gl-matrix";

export function getCirclePositions(center: vec3, radius: number, numSegments: number): Float32Array {
    const vertices = [];
    const angleIncrement = (2 * Math.PI) / numSegments;
    for (let i = 0; i < numSegments; i++) {
        const angle = i * angleIncrement;
        const x = center[0] + radius * Math.cos(angle);
        const z = center[2] + radius * Math.sin(angle);
        vertices.push(x, center[1], z);
    }

    return new Float32Array(vertices);
}
