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

const highp float starConstant = 1.0;
const highp float starLinear = 0.09;
const highp float starQuadratic = 0.032;
const highp vec3 starAmbient = vec3(0, 0, 0);
const highp vec3 starDiffuse = vec3(1.0, 1.0, 1.0);
const highp vec3 starSpecular = vec3(1.0, 1.0, 1.0);

const highp vec3 materialDiffuse = vec3(1.0, 1.0, 1.0);
const highp vec3 materialSpecular = vec3(0.0, 0.0, 0.0);
const highp float materialShininess = 32.0;

highp vec3 calculatePointLight(highp vec3 starLoc, highp vec3 normal, highp vec3 fragPos, highp vec3 viewDir) {

    // Set them bright red
    highp vec3 lightDir = normalize(starLoc - fragPos);
    highp float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    highp vec3 reflectDir = reflect(-lightDir, normal);
    highp float spec = pow(max(dot(viewDir, reflectDir), 0.0), materialShininess);

    // attenuation
    highp float dist = length(starLoc - fragPos);
    highp float attenuation = 1.0 / (starConstant + (starLinear * dist) + (starQuadratic * (dist * dist)));

    // results
    highp vec3 ambient = starAmbient * materialDiffuse;
    highp vec3 diffuse = starDiffuse * diff * materialDiffuse * uFragColor.rgb;
    highp vec3 specular = starSpecular * spec * materialSpecular;

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
    highp vec3 ambient = vec3(0.005, 0.005, 0.005);
    highp vec3 result = ambient;

    for (int i = 0; i < MAX_STARS; i++) {
        if (i >= uNumStars) {
            break;
        }
        result += calculatePointLight(uStarLocations[i], norm, vFragPosition, viewDir);
    }

    // Apply the result to the fragment color
    fragColor = vec4(result * uFragColor.rgb, 1.0);

    if (uIsStar > 0) {
        ambient = vec3(1.5, 1.5, 1.5);
        fragColor = vec4(ambient * uFragColor.rgb, 1.0);
        brightColor = fragColor;
    } else {
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }


    // Old directional lighting code
    /*
    highp vec3 ambient = vec3(0.005, 0.005, 0.005);
    
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
    

    // Normally, bloom lighting extracts based on brightness. Instead, I extract colors based on whether they're stars.
    if (uIsStar > 0) {
        brightColor = fragColor;
    } else {
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    */
}