// Directional lighting from some source (does not follow camera)

attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vTransformedNormal;
varying highp vec4 vPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTransformedNormal = aVertexNormal;
    vPosition = uModelViewMatrix * aVertexPosition;
}