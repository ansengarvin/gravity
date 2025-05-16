import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function DebugStats() {
    const debug = useSelector((state: RootState) => state.information);

    return (
        <DebugStatsStyle>
            <h2>Debug Stats</h2>
            <h3>Simulation</h3>
            <div>Number of Bodies: {debug.numActiveBodies}</div>
            <div>Number of Stars: {debug.numStars}</div>
            <h3>OpenGL</h3>
            <div>Max Vertex Uniform Vectors: {debug.maxVertexUniformVectors}</div>
            <div>Max Fragment Uniform Vectors: {debug.maxFragmentUniformVectors}</div>
            <div>Max Uniform Buffer Binding Points: {debug.maxUniformBufferBindingPoints}</div>
            <div>Max AA Samples: {debug.maxSamples}</div>
            <div>Active Uniforms: {debug.numActiveUniforms}</div>
            <div>Active Uniform Vectors: {debug.numActiveUniformVectors}</div>
            <div>Intenal Format Used: {debug.internalFormatUsed}</div>
            <h3>OpenGL Extensions</h3>
            <div>
                RBGA32F Supported: {debug.rgba32fSupported !== null ? (debug.rgba32fSupported ? "TRUE" : "FALSE") : ""}
            </div>
            <div>
                OES Float Linear Supported:{" "}
                {debug.oesFloatLinearSupported !== null ? (debug.oesFloatLinearSupported ? "TRUE" : "FALSE") : ""}
            </div>
            <div>
                RBGA16F Supported: {debug.rgba16fSupported !== null ? (debug.rgba16fSupported ? "TRUE" : "FALSE") : ""}
            </div>
            <div>
                OES Half Float Linear Supported:{" "}
                {debug.oesHalfFloatLinearSupported !== null
                    ? debug.oesHalfFloatLinearSupported
                        ? "TRUE"
                        : "FALSE"
                    : ""}
            </div>
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
