#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexCoords;

uniform mat4 uNormalMatrix;
uniform mat4 uViewNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out highp vec3 vNormal;
out highp vec3 vFragPosition;
out highp vec3 vFragPositionLocal;
out highp vec2 vTexCoords;
out highp vec3 vViewPosition;
out highp vec3 vViewNormal;

void main(void) {
    vec4 viewPos = uModelViewMatrix * aVertexPosition;
    vViewPosition = viewPos.xyz; // View position in world space
    vViewNormal = normalize(mat3(uViewNormalMatrix) * aVertexNormal);
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vFragPositionLocal = vec3(aVertexPosition);
    vFragPosition = vec3(uModelMatrix * aVertexPosition);
    vNormal = normalize(mat3(uNormalMatrix) * aVertexNormal);
    vTexCoords = aTexCoords;
}