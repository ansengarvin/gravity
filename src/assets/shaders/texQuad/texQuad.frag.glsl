#version 300 es

out highp vec4 FragColor;

in highp vec2 TexCoords;

uniform sampler2D uScreenTex;

void main() {
    // Output color = color of the texture at the specified texture coordinates
    //FragColor = texture(uScreenTex, TexCoords);
    // Set fragcolor to entirely red
    FragColor = vec4(0.5, 0.2, 0.0, 1.0);
}