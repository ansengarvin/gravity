// Tell WebGL how to pull out the positions from the position

import { Buffers } from "./buffers";
import { AttribLocations } from "./shaderPrograms";

// buffer into the vertexPosition attribute.
export function setPositionAttribute(gl: WebGL2RenderingContext, buffers: Buffers, attribLocations: AttribLocations) {
    const numComponents = 3; // pull out 3 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
export function setNormalAttribute(gl: WebGL2RenderingContext, buffers: Buffers, attribLocations: AttribLocations) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribLocations.vertexNormal);
}

export function setPositionAttribute2D(gl: WebGL2RenderingContext, buffers: Buffers, attribLocations: AttribLocations) {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
}

// tex coords
export function setTexCoordAttribute(gl: WebGL2RenderingContext, buffers: Buffers, attribLocations: AttribLocations) {
    if (!buffers.texCoord) {
        console.warn("No texCoord buffer found");
        return;
    }
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
    gl.vertexAttribPointer(attribLocations.texCoords, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribLocations.texCoords);
}