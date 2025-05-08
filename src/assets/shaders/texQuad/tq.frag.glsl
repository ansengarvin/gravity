#version 300 es

out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D uScreenTex;

void main() {
    // Output color = color of the texture at the specified texture coordinates
    FragColor = texture(uScreenTex, TexCoords);
}