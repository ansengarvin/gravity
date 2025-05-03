#version 300 es

// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 500

uniform highp vec4 uFragColor;
in highp vec3 vNormal;


in highp vec3 vFragPosition;

uniform highp int uNumStars;
uniform highp int uIsStar;
uniform highp vec3 uStarLocations[MAX_STARS];

// layout(std140) uniform StarLights{
//     vec3 uboStarLocations[MAX_STARS];
// };

out highp vec4 fragColor;

void main(void) {
    highp vec3 ambient = vec3(0.05, 0.05, 0.05);
    
    highp vec3 normal = normalize(vNormal);

    //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    highp vec3 directionalVector = normalize(vec3(0, 0, -1));
    highp vec3 diffuse = vec3(0, 0, 0);

    for (int i = 0; i < MAX_STARS; i++) {
        if (i >= uNumStars) {
            break;
        }
        // Calculate the direction to the largest star
        directionalVector = normalize(uStarLocations[i] - vFragPosition);
        highp float diff = max(dot(normal, directionalVector), 0.0);

        // Calculate the distance
        highp float dist = distance(uStarLocations[i], vFragPosition);

        // Light should linearly attenuate from 100% to 0%, falling off to 0 at 50au
        // According to graphing calculator, y = -x/50 + 1 is the formula
        // (This has no basis in physics, but may produce decent-looking results)
        highp float attenuation_factor = ((-1.0 * dist) / 50.0) + 1.0;
        
        diffuse += diff * uFragColor.rgb * attenuation_factor;
    }
    
    /*
    // Light calculated only from single-most-massive star
    if (uNumStars > 0) {

        // Calculate the direction to the largest star
        directionalVector = normalize(uStarLocations[0] - vFragPosition);
        highp float diff = max(dot(normal, directionalVector), 0.0);

        // Calculate the distance
        highp float dist = distance(uStarLocations[0], vFragPosition);

        // Light should linearly attenuate from 100% to 0%, falling off to 0 at 50au
        // According to graphing calculator, y = -x/50 + 1 is the formula
        // (This has no basis in physics, but may produce decent-looking results)
        highp float attenuation_factor = ((-1.0 * dist) / 50.0) + 1.0;
        
        diffuse += diff * uFragColor.rgb * attenuation_factor;
    }
    */

    if (uIsStar > 0) {
        ambient = vec3(1.5, 1.5, 1.5);
        diffuse = vec3(0.0, 0.0, 0.0);
    }



    highp vec3 result = (ambient + diffuse) * uFragColor.rgb;
    fragColor = vec4(result, uFragColor.a);
}