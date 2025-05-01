// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 1000

uniform highp vec4 uFragColor;
varying highp vec3 vTransformedNormal;
varying highp vec4 vPosition;

uniform highp int uNumStars;
uniform highp vec3 uStarLocations[MAX_STARS];
uniform highp int uIsStar;

void main(void) {
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);

    if (uIsStar == 1) {
        ambientLight = vec3(1.0, 1.0, 1.0); // No ambient light for stars
    }
    highp vec3 normal = normalize(vTransformedNormal);
    highp vec3 lighting = ambientLight;

    // Iterate through the stars and calculate their contribution
    if (uIsStar == 0) {
        for (int i = 0; i < MAX_STARS; i++) {
            if (i >= uNumStars) break;

            highp vec3 starDirection = normalize(uStarLocations[i] - vPosition.xyz);
            highp float starIntensity = max(dot(normal, starDirection), 0.0);

            // Add the star's contribution to the lighting
            lighting += vec3(1.0, 1.0, 1.0) * starIntensity; // Assuming white light for stars
        }
    }
    

    gl_FragColor = vec4(uFragColor.rgb * lighting, uFragColor.a);
}