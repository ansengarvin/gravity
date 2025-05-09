import { Model } from "../gltf/model";

export interface Buffers {
    position: WebGLBuffer;
    indices: WebGLBuffer;
    normal: WebGLBuffer;
}

export function initBuffers(gl: WebGL2RenderingContext, model: Model) {
    const positionBuffer = initPositionBuffer(gl, model.positions);
    const indexBuffer = initIndexBuffer(gl, model.indices);
    const normalBuffer = initNormalBuffer(gl, model.normals);

    return {
        position: positionBuffer,
        indices: indexBuffer,
        normal: normalBuffer,
    };
}

function initPositionBuffer(gl: WebGL2RenderingContext, positions: Float32Array): WebGLBuffer {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    return positionBuffer;
}

function initIndexBuffer(gl: WebGL2RenderingContext, indices: Uint16Array): WebGLBuffer {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    // Now send the element array to GL

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indexBuffer;
}

function initNormalBuffer(gl: WebGL2RenderingContext, normals: Float32Array): WebGLBuffer {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    return normalBuffer;
}
