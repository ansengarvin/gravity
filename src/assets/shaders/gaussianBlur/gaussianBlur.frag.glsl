#version 300 es

/*
    Guassian Blur Fragment Shader
    Adapted from:
    https://learnopengl.com/Advanced-Lighting/Bloom
*/

out highp vec4 FragColor;

in highp vec2 TexCoords;

uniform sampler2D uImage;
uniform highp int uHorizontal; // 1 for horizontal blur, 0 for vertical blur
uniform highp vec2 uViewportSize;
uniform highp float uAspectRatio;

highp float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main() {
    /*
        The tutorial calls for tex_offset = 1.0 / vec2(textureSize(uImage, 0).
        This works for them, because the resolution of their canvas is the same as their screen size.
        The resolution of my canvas is independent from the screen size - And my texture sizes are set to the canvas size.
        This resulted in an uneven gaussian blur, and by extension, a squashed-looking bloom.
        Setting the texel offset to be based on the viewport size allows for even blurring.
    */
    highp vec2 tex_offset = 1.0 / uViewportSize; // Texture coordinates offset

    highp vec3 result = texture(uImage, TexCoords).rgb * weight[0];
    if (uHorizontal == 1) {
        for (int i = 1; i < 5; ++i) {
            result += texture(uImage, TexCoords + vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
            result += texture(uImage, TexCoords - vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
        }
    } else {  
        for (int i = 1; i < 5; ++i) {
            result += texture(uImage, TexCoords + vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
            result += texture(uImage, TexCoords - vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
        }
    }
    FragColor = vec4(result, 1.0);
}