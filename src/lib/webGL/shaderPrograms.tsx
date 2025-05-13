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
        uViewPosition: WebGLUniformLocation | null;
    };
}

export interface TexQuadProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        uScreenTex: WebGLUniformLocation | null;
    };
}

export interface GaussianBlurProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        uImage: WebGLUniformLocation | null;
        uHorizontal: WebGLUniformLocation | null;
        uViewportSize: WebGLUniformLocation | null;
    };
}

export interface BloomProgramInfo {
    program: WebGLProgram;
    attribLocations: AttribLocations;
    uniformLocations: {
        uScene: WebGLUniformLocation | null;
        uBloom: WebGLUniformLocation | null;
    };
}
