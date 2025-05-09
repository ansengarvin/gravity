#version 300 es

// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 32

uniform highp vec4 uFragColor;
in highp vec3 vNormal;


in highp vec3 vFragPosition;

uniform highp int uNumStars;
uniform highp int uIsStar;
uniform highp vec3 uStarLocations[MAX_STARS];

// layout(std140, binding=0) buffer StarLights {
//     highp vec3 uboStarLocations[MAX_STARS];
// };

layout(location=0) out highp vec4 fragColor;
layout(location=1) out highp vec4 brightColor;

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
        if (attenuation_factor < 0.0) {
            attenuation_factor = 0.0;
        }
        
        diffuse += diff * uFragColor.rgb * attenuation_factor;
    }

    if (uIsStar > 0) {
        ambient = vec3(1.5, 1.5, 1.5);
        diffuse = vec3(0.0, 0.0, 0.0);
    }

    highp vec3 result = (ambient + diffuse) * uFragColor.rgb;
    fragColor = vec4(result, uFragColor.a);

    // THis is normally how bloom would be handled - based on the brightness of all fragments.
    /*
    float brightness = dot(FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    if(brightness > 1.0) {
        BrightColor = vec4(FragColor.rgb, 1.0);
    } else {
        BrightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    */

    // My approach will be to just extract the light from stars and add a bloom effect therein.
    if (uIsStar > 0) {
        brightColor = fragColor;
    } else {
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}