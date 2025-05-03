#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out highp vec3 vTransformedNormal;
out highp vec4 vPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTransformedNormal = mat3(uNormalMatrix) * aVertexNormal; // Multiplying vertex normal by normal matrix causes light to rotate with camera
    vPosition = uModelViewMatrix * aVertexPosition;
}