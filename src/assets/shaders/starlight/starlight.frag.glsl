#version 300 es

// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 32

precision highp float;

uniform vec4 uFragColor;
in vec3 vNormal;

in vec3 vFragPosition;
in highp vec2 vTexCoords;

uniform float uDeltaTime;
uniform int uNumStars;
uniform int uIsStar;
uniform float uMass;
uniform float uTemperature;
uniform vec3 uStarLocations[MAX_STARS];
uniform vec3 uViewPosition;

uniform lowp sampler2DArray uNoiseTex;
uniform int uNoiseTexSlice;

// layout(std140, binding=0) buffer StarLights {
//     vec3 uboStarLocations[MAX_STARS];
// };

layout(location=0) out vec4 fragColor;
layout(location=1) out vec4 brightColor;

const float THRESHOLD_GAS_GIANT = 0.00003;
const float THRESHOLD_BROWN_DWARF = 0.012;
const float THRESHOLD_STAR = 0.08;
const float THRESHOLD_SOLAR = 1.0;

const float STAR_CONSTANT = 1.0;
// const float STAR_LINEAR = 0.09;
const float STAR_LINEAR = 0.0;
const float STAR_QUADRATIC = 0.032;
const vec3 STAR_AMBIENT = vec3(0.0, 0, 0);
const vec3 STAR_DIFFUSE = vec3(1.0, 1.0, 1.0);
const vec3 STAR_SPECULAR = vec3(1.0, 1.0, 1.0);

const vec3 MATERIAL_DIFFUSE = vec3(1.0, 1.0, 1.0);
//const vec3 MATERIAL_SPECULAR = vec3(1.0, 1.0, 1.0);
const vec3 MATERIAL_SPECULAR = vec3(0.0, 0.0, 0.0);
const float MATERIAL_SHINNINESS = 32.0;

const float PI = 3.14159265358979323846;

vec3 gasGiantColor(float n) {
    vec3 color = uFragColor.rgb;
    float s = vTexCoords.s;
    float t = vTexCoords.t;

    t += n;

    //t += (PI / 100.0) * sin(s * 10.0 * PI +  100.0 * t * (uMass / 10.0));

    vec3 color1 = uFragColor.rgb;
    vec3 color2 = uFragColor.rgb * 0.5;

    // Vertical bands
    //float band = mod(noisyT * 10.0, 1.0);
    int numBands = 10;
    float bandPosition = t * float(numBands);
    float bandFraction = fract(bandPosition);

    // Create smooth transition
    const float tolerance = 0.4;
    float smoothFactor = smoothstep(1.0 - tolerance, 1.0 + tolerance, bandFraction);

    int bandIndex = int(bandPosition);

    if (bandIndex % 2 == 0) {
        // Even band, use color1
        color = mix(color1, color2, smoothFactor);
    } else {
        // Odd band, use color2
        color = mix(color2, color1, smoothFactor);
    }
    return color;
}

vec3 terrestrialColor(float n) {
    const float diameterA = 0.1;
    const float diameterB = 0.1;

    // Calculate vertical and horizontal radii for ellipse
    float aRadius = diameterA / 2.0;
    float bRadius = diameterB / 2.0;

    // Calculate number of segments in s, given each diameter
    int numInS = int(vTexCoords.s / diameterA);
    int numInT = int(vTexCoords.t / diameterB);

    // Calculate horizontal and vertical centers of each segment, given the radius
    float sCenter = (float(numInS) * diameterA) + aRadius;
    float ds = vTexCoords.s - sCenter;
    float tCenter = (float(numInT) * diameterB) + bRadius;
    float dt = vTexCoords.t - tCenter;

    float dist = sqrt(ds * ds + dt * dt);
    float newDist = dist + n;
    float scale = newDist / dist;

    ds = ds * scale;
    dt = dt * scale;

    float left_half = abs(ds) / aRadius;
    float right_half = abs(dt) / bRadius;

    float d = pow(left_half, 2.0) + pow(right_half, 2.0);

    float t = smoothstep(1.0, 1.0, d);
    // Planet color for land color
    vec3 landColor = uFragColor.rgb;
    // Planet color, darkened for "water" color
    vec3 waterColor = landColor * 0.5;
    return mix(landColor, waterColor, t);
}



vec3 calculatePointLight(vec3 starLoc, vec3 normal, vec3 fragPos, vec3 viewDir) {

    // Set them bright red
    vec3 lightDir = normalize(starLoc - fragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), MATERIAL_SHINNINESS);

    // attenuation
    float dist = length(starLoc - fragPos);
    float attenuation = 1.0 / (STAR_CONSTANT + (STAR_LINEAR * dist) + (STAR_QUADRATIC * (dist * dist)));

    // results
    vec3 ambient = STAR_AMBIENT * MATERIAL_DIFFUSE;
    vec3 diffuse = STAR_DIFFUSE * diff * MATERIAL_DIFFUSE;
    vec3 specular = STAR_SPECULAR * spec * MATERIAL_SPECULAR;

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    // c
    return ambient + diffuse + specular;
}

float makeNoise(float amp, float freq) {
    float uNoiseTexSliceFloat = float(uNoiseTexSlice);
    vec4 noiseTex = texture(uNoiseTex, freq*vec3(vTexCoords, uNoiseTexSliceFloat));
    float noise = noiseTex.r + noiseTex.g + noiseTex.b + noiseTex.a;
    noise = noise - 2.0;
    noise *= amp;
    return noise;
}

void main(void) {
    vec3 norm = vNormal;
    vec3 viewDir = normalize(uViewPosition - vFragPosition);

    // Set regular dim ambient color
    vec3 ambient = vec3(0.05, 0.05, 0.05) * uFragColor.rgb;
    vec3 result = ambient;

    for (int i = 0; i < MAX_STARS; i++) {
        if (i >= uNumStars) {
            break;
        }
        result += calculatePointLight(uStarLocations[i], norm, vFragPosition, viewDir);
    }



    // Apply the result to the fragment color
    vec3 planetColor = uFragColor.rgb;
    if (uMass >= THRESHOLD_GAS_GIANT) {
        // Gas giant
        float gasAmp = 0.1;
        planetColor = gasGiantColor(makeNoise(gasAmp, 0.25));
    } else if (uMass >= THRESHOLD_BROWN_DWARF) {
        // TODO
    } else if (uMass >= THRESHOLD_STAR) {
        // TODO
    } else {
        // Solid body
        planetColor = terrestrialColor(makeNoise(0.5, 0.15));
    }
    fragColor = vec4(result * planetColor, 1.0);

    //fragColor = vec4(texColor, 1.0);

    if (uIsStar > 0) {
        ambient = vec3(1.5, 1.5, 1.5);
        fragColor = vec4(ambient * uFragColor.rgb, 1.0);
        brightColor = fragColor;
    } else {
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}