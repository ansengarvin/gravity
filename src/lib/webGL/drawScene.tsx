import { mat4 } from "gl-matrix";
import { ProgramInfo } from "./programInfo";
import { Buffers } from "./buffers";

export function drawSceneCube(
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: Buffers,
    cubeRotation: number,
) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const canvas = gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;


    

    
    /*
        Binding buffers
    */
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);
    setNormalAttribute(gl, buffers, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program);

    /*
        Create Projection Matrix
    */
    const projectionMatrix = mat4.create();

    // note: glMatrix always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the shader uniform for projection matrix
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );

    // Create a view matrix for the camera
    const cameraMatrix = mat4.create();
    mat4.translate(
        cameraMatrix, // destination matrix
        cameraMatrix, // matrix to translate
        [0.0, 0.0, -20.0], // amount to translate
    );

    
    /*
        Creating model view matrices and drawing cubes
    */
    for (let i = 0; i < 2; i++) {
        // Creates a matrix of the model and translates it into world space
        const modelMatrix = mat4.create();
        mat4.translate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to translate
            [-0.0, i*3, 0.0],
        )
        mat4.rotate(
            modelMatrix, // destination matrix)
            modelMatrix, // matrix to rotate
            cubeRotation, // amount to rotate in radians
            [0, 1, 0], // axis to rotate around
        )

        // Combines the model and view matrices
        const modelViewMatrix = mat4.create();
        mat4.multiply(
            modelViewMatrix, // destination matrix
            cameraMatrix, // matrix to multiply
            modelMatrix, // matrix to multiply
        );

        // Normals should be applied to the model view matrix.
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        // Sets shader uniforms for model normals
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix,
        );

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
) {
    const numComponents = 3; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
