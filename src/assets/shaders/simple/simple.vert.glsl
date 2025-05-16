#version 300 es

in vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}