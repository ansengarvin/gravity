export enum LightingMode {
    CAMLIGHT = "camlight",
    STARLIGHT = "starlight",
}

export interface AttribLocations {
    vertexPosition: GLint;
    vertexNormal: GLint;
}

export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelMatrix: WebGLUniformLocation | null;
        viewMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
        normalMatrix: WebGLUniformLocation | null;
        uFragColor: WebGLUniformLocation | null;
        uStarLocations: WebGLUniformLocation | null;
        uNumStars: WebGLUniformLocation | null;
        uIsStar: WebGLUniformLocation | null;
    };
}

// export interface CamlightProgramInfo {
//     program: WebGLProgram;
//     attribLocations: AttribLocations;
//     uniformLocations: {
//         projectionMatrix: WebGLUniformLocation | null;
//         modelMatrix: WebGLUniformLocation | null;
//         viewMatrix: WebGLUniformLocation | null;
//         modelViewMatrix: WebGLUniformLocation | null;
//         normalMatrix: WebGLUniformLocation | null;
//         uFragColor: WebGLUniformLocation | null;
//         uStarLocations: WebGLUniformLocation | null;
//         uNumStars: WebGLUniformLocation | null;
//         uIsStar: WebGLUniformLocation | null;
//     };
// }

// export interface StarlightProgramInfo {
//     program: WebGLProgram;
//     attribLocations: AttribLocations;
//     uniformLocations: {
//         projectionMatrix: WebGLUniformLocation | null;
//         modelMatrix: WebGLUniformLocation | null;
//         viewMatrix: WebGLUniformLocation | null;
//         modelViewMatrix: WebGLUniformLocation | null;
//         normalMatrix: WebGLUniformLocation | null;
//         uFragColor: WebGLUniformLocation | null;
//         uStarLocations: WebGLUniformLocation | null;
//         uNumStars: WebGLUniformLocation | null;
//         uIsStar: WebGLUniformLocation | null;
//     };
// }
