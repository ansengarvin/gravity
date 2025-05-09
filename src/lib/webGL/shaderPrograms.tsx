export enum LightingMode {
    CAMLIGHT = "camlight",
    STARLIGHT = "starlight",
}

export interface AttribLocations {
    vertexPosition: GLint;
    vertexNormal: GLint;
    texCoords: GLint;
}

export interface CamlightProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
        normalMatrix: WebGLUniformLocation | null;
        uFragColor: WebGLUniformLocation | null;
    };
}

export interface StarlightProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
        normalMatrix: WebGLUniformLocation | null;
        uFragColor: WebGLUniformLocation | null;
        uStarLocations: WebGLUniformLocation | null;
        uNumStars: WebGLUniformLocation | null;
        uIsStar: WebGLUniformLocation | null;
    };
}

export interface TexQuadProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        uScreenTex: WebGLUniformLocation | null;
    };
}
