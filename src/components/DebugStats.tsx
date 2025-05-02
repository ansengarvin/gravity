import styled from "@emotion/styled";

export interface DebugStatsProps {
    maxVertexUniformVectors: number;
    maxFragmentUniformVectors: number;
    numActiveBodies: number;
    numActiveUniforms: number;
    numActiveUniformVectors: number;
}

export function DebugStats(props: DebugStatsProps) {
    const {
        numActiveBodies,
        numActiveUniforms,
        maxVertexUniformVectors,
        maxFragmentUniformVectors,
        numActiveUniformVectors,
    } = props;

    return (
        <DebugStatsStyle>
            <div>Debug Stats</div>
            <div>Max Vertex Uniform Vectors: {maxVertexUniformVectors}</div>
            <div>Max Fragment Uniform Vectors: {maxFragmentUniformVectors}</div>
            <div>Active Bodies: {numActiveBodies}</div>
            <div>Active Uniforms: {numActiveUniforms}</div>
            <div>Active Uniform Vectors: {numActiveUniformVectors}</div>
        </DebugStatsStyle>
    );
}

const DebugStatsStyle = styled.div`
    grid-area: debug;
    padding-left: 20px;
    padding-top: 20px;
    display: flex;

    flex-direction: column;
`;

export function calculateUniformVectors(gl: WebGLRenderingContext, program: WebGLProgram): number {
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
