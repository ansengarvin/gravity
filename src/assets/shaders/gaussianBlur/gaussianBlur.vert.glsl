#version 300 es

in highp vec2 aVertexPosition;
in highp vec2 aTexCoords;

out highp vec2 TexCoords;

void main()
{
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    TexCoords = aTexCoords;
}