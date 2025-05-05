export enum LightingMode {
    CAMLIGHT = "camlight",
    STARLIGHT = "starlight",
}

export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor: GLint;
        vertexNormal: GLint;
    };
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

export interface CamlightProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor: GLint;
        vertexNormal: GLint;
    };
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

export interface StarlightProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor: GLint;
        vertexNormal: GLint;
    };
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
