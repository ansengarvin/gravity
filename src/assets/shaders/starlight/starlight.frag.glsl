#version 300 es

// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 32

uniform highp vec4 uFragColor;
in highp vec3 vNormal;

in highp vec3 vFragPosition;

uniform highp int uNumStars;
uniform highp int uIsStar;
uniform highp vec3 uStarLocations[MAX_STARS];
uniform highp vec3 uViewPosition;

// layout(std140, binding=0) buffer StarLights {
//     highp vec3 uboStarLocations[MAX_STARS];
// };

layout(location=0) out highp vec4 fragColor;
layout(location=1) out highp vec4 brightColor;

const highp float STAR_CONSTANT = 1.0;
// const highp float STAR_LINEAR = 0.09;
const highp float STAR_LINEAR = 0.0;
const highp float STAR_QUADRATIC = 0.032;
const highp vec3 STAR_AMBIENT = vec3(0.0, 0, 0);
const highp vec3 STAR_DIFFUSE = vec3(1.0, 1.0, 1.0);
const highp vec3 STAR_SPECULAR = vec3(1.0, 1.0, 1.0);

const highp vec3 MATERIAL_DIFFUSE = vec3(1.0, 1.0, 1.0);
//const highp vec3 MATERIAL_SPECULAR = vec3(1.0, 1.0, 1.0);
const highp vec3 MATERIAL_SPECULAR = vec3(0.0, 0.0, 0.0);
const highp float MATERIAL_SHINNINESS = 32.0;

highp vec3 calculatePointLight(highp vec3 starLoc, highp vec3 normal, highp vec3 fragPos, highp vec3 viewDir) {

    // Set them bright red
    highp vec3 lightDir = normalize(starLoc - fragPos);
    highp float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    highp vec3 reflectDir = reflect(-lightDir, normal);
    highp float spec = pow(max(dot(viewDir, reflectDir), 0.0), MATERIAL_SHINNINESS);

    // attenuation
    highp float dist = length(starLoc - fragPos);
    highp float attenuation = 1.0 / (STAR_CONSTANT + (STAR_LINEAR * dist) + (STAR_QUADRATIC * (dist * dist)));

    highp vec3 fc = uFragColor.rgb;
    // if(dot(normal, lightDir) > 0.0) {
    //     fc = vec3(1.0, 0.0, 0.0);
    // } else {
    //     fc = vec3(0.0, 0.0, 1.0);
    // }

    // results
    highp vec3 ambient = STAR_AMBIENT * MATERIAL_DIFFUSE * fc;
    highp vec3 diffuse = STAR_DIFFUSE * diff * MATERIAL_DIFFUSE * fc;
    highp vec3 specular = STAR_SPECULAR * spec * MATERIAL_SPECULAR * fc;

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    // c
    return ambient + diffuse + specular;
}

void main(void) {
    highp vec3 norm = vNormal;
    highp vec3 viewDir = normalize(uViewPosition - vFragPosition);

    // Set regular dim ambient color
    highp vec3 ambient = vec3(0.05, 0.05, 0.05) * uFragColor.rgb;
    highp vec3 result = ambient;

    for (int i = 0; i < MAX_STARS; i++) {
        if (i >= uNumStars) {
            break;
        }
        result += calculatePointLight(uStarLocations[i], norm, vFragPosition, viewDir);
    }

    // Apply the result to the fragment color
    fragColor = vec4(result, 1.0);

    if (uIsStar > 0) {
        ambient = vec3(1.5, 1.5, 1.5);
        fragColor = vec4(ambient * uFragColor.rgb, 1.0);
        brightColor = fragColor;
    } else {
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}