// Directional lighting from some source (does not follow camera)

attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vNormal;
varying highp vec3 vFragPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vFragPosition = vec3(uModelMatrix * aVertexPosition);
    vNormal = aVertexNormal;
    
}