#version 300 es

/*
    Bloom adding
    Source:
    https://learnopengl.com/Advanced-Lighting/Bloom
*/

out highp vec4 FragColor;
in highp vec2 TexCoords;

uniform highp sampler2D uScene;
uniform highp sampler2D uBloom;

void main() {
    const highp float gamma = 1.25;
    const highp float exposure = 1.0;

    highp vec3 sceneColor = texture(uScene, TexCoords).rgb;
    highp vec3 bloomColor = texture(uBloom, TexCoords).rgb;

    // Adding an additional layer of gamma to bloomcolor makes for a nice looking result
    bloomColor = pow(bloomColor, vec3(1.0 / 1.25));

    highp vec3 color = sceneColor + bloomColor;

    highp vec3 result = vec3(1.0) - exp(-color * exposure);

    result = pow(result, vec3(1.0 / 1.0));
    //result = sceneColor;
    //result = bloomColor;
    
    FragColor = vec4(result, 1.0);
}