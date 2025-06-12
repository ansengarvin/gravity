#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexCoords;

uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out highp vec3 vNormal;
out highp vec3 vFragPosition;
out highp vec2 vTexCoords;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vFragPosition = vec3(uModelMatrix * aVertexPosition);
    vNormal = normalize(mat3(uNormalMatrix) * aVertexNormal);
    vTexCoords = aTexCoords;
}