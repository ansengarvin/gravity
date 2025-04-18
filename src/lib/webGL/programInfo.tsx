export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor: GLint;
        vertexNormal: GLint;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
        normalMatrix: WebGLUniformLocation | null;
        uFragColor: WebGLUniformLocation | null;
    };
}
