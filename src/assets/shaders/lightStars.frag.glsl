// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 1000

uniform highp vec4 uFragColor;
varying highp vec3 vNormal;


varying highp vec3 vFragPosition;

uniform highp int uNumStars;
uniform highp vec3 uStarLocations[MAX_STARS];
uniform highp int uIsStar;

void main(void) {
    highp vec3 ambient = vec3(0.3, 0.3, 0.3);
    
    highp vec3 normal = normalize(vNormal);

    //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    highp vec3 directionalVector = normalize(vec3(0, 0, -1));
    highp vec3 diffuse = vec3(0, 0, 0);

    if (uNumStars > 0) {
        directionalVector = normalize(uStarLocations[0] - vFragPosition);
        highp float diff = max(dot(normal, directionalVector), 0.0);
        diffuse = diff * uFragColor.rgb;
    }



    highp vec3 result = (ambient + diffuse) * uFragColor.rgb;
    gl_FragColor = vec4(result, uFragColor.a);
}