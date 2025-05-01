// Flat-shaded with monodirectional light travelling with the camera

uniform highp vec4 uFragColor;
uniform highp int uIsStar;

varying highp vec3 vTransformedNormal;

void main(void) {
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec3 normal = normalize(vTransformedNormal);
    highp float directional = max(dot(normal, directionalVector), 0.0);

    // if (uIsStar > 0) {
    //     ambientLight = vec3(1.0, 1.0, 1.0);
    //     directionalLightColor = vec3(0.2, 0.2, 0.2);
    // }

    highp vec3 lighting = ambientLight + (directionalLightColor * directional);
    gl_FragColor = vec4(uFragColor.rgb * lighting, uFragColor.a);
}