import styled from "@emotion/styled";

export interface DebugStatsProps {
    numActiveBodies: number;
    numStars: number;
    maxVertexUniformVectors: number;
    maxFragmentUniformVectors: number;
    maxUniformBufferBindingPoints: number;
    numActiveUniforms: number;
    numActiveUniformVectors: number;
    maxSamples: number;
}

export function DebugStats(props: DebugStatsProps) {
    const {
        numActiveBodies,
        numStars,
        numActiveUniforms,
        maxVertexUniformVectors,
        maxFragmentUniformVectors,
        maxUniformBufferBindingPoints,
        numActiveUniformVectors,
        maxSamples,
    } = props;

    return (
        <DebugStatsStyle>
            <h2>Debug Stats</h2>
            <h3>Simulation</h3>
            <div>Number of Bodies: {numActiveBodies}</div>
            <div>Number of Stars: {numStars}</div>
            <h3>OpenGL</h3>
            <div>Max Vertex Uniform Vectors: {maxVertexUniformVectors}</div>
            <div>Max Fragment Uniform Vectors: {maxFragmentUniformVectors}</div>
            <div>Max Uniform Buffer Binding Points: {maxUniformBufferBindingPoints}</div>
            <div>Max Antialiasing Samples: {maxSamples}</div>
            <div>Active Uniforms: {numActiveUniforms}</div>
            <div>Active Uniform Vectors: {numActiveUniformVectors}</div>
        </DebugStatsStyle>
    );
}

const DebugStatsStyle = styled.div`
    position: absolute;
    top: 100px;
    left: 20px;
    display: flex;
    z-index: 2;

    flex-direction: column;
    font-size: 0.75rem;

    h2,
    h3 {
        margin: 0;
    }
`;

export function calculateUniformVectors(gl: WebGL2RenderingContext, program: WebGLProgram): number {
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    let totalVectors = 0;

    for (let i = 0; i < numUniforms; i++) {
        const uniformInfo = gl.getActiveUniform(program, i);
        if (!uniformInfo) continue;

        const type = uniformInfo.type;
        const size = uniformInfo.size; // Array size (1 for non-array uniforms)

        // Map WebGL uniform types to vector counts
        let vectors = 0;
        switch (type) {
            case gl.FLOAT:
                vectors = 1;
                break;
            case gl.FLOAT_VEC2:
                vectors = 1;
                break;
            case gl.FLOAT_VEC3:
                vectors = 1;
                break;
            case gl.FLOAT_VEC4:
                vectors = 1;
                break;
            case gl.FLOAT_MAT2:
                vectors = 2;
                break;
            case gl.FLOAT_MAT3:
                vectors = 3;
                break;
            case gl.FLOAT_MAT4:
                vectors = 4;
                break;
            default:
                break; // Handle other types if needed
        }

        totalVectors += vectors * size;
    }
    return totalVectors;
}
