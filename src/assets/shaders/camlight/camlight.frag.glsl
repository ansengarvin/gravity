#version 300 es

uniform highp vec4 uFragColor;

in highp vec3 vTransformedNormal;

out highp vec4 fragColor;

void main(void) {
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec3 normal = normalize(vTransformedNormal);
    highp float directional = max(dot(normal, directionalVector), 0.0);

    highp vec3 lighting = ambientLight + (directional);
    fragColor = vec4(uFragColor.rgb * lighting, uFragColor.a);
}