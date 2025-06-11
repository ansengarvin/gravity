#version 300 es

// Flat-shaded with monodirectional light travelling with the camera
#define MAX_STARS 32

uniform highp vec4 uFragColor;
in highp vec3 vNormal;

in highp vec3 vFragPosition;
in highp vec2 vTexCoords;

uniform int uNumStars;
uniform int uIsStar;
uniform highp float uMass;
uniform highp float uTemperature;
uniform highp vec3 uStarLocations[MAX_STARS];
uniform highp vec3 uViewPosition;

uniform lowp sampler2DArray uNoiseTex;
uniform int uNoiseTexSlice;

// layout(std140, binding=0) buffer StarLights {
//     highp vec3 uboStarLocations[MAX_STARS];
// };

layout(location=0) out highp vec4 fragColor;
layout(location=1) out highp vec4 brightColor;

const highp float THRESHOLD_GAS_GIANT = 0.00003;
const highp float THRESHOLD_BROWN_DWARF = 0.012;
const highp float THRESHOLD_STAR = 0.08;
const highp float THRESHOLD_SOLAR = 1.0;

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

const highp float PI = 3.14159265358979323846;

highp vec3 gasGiantColor(highp float n) {
    highp vec3 color = uFragColor.rgb;
    highp float s = vTexCoords.s;
    highp float t = vTexCoords.t;

    t += n;

    t += (PI / 100.0) * sin(s * 10.0 * PI +  100.0 * t * (uMass / 10.0));

    // Vertical bands
    //highp float band = mod(noisyT * 10.0, 1.0);
    int numBands = 10;
    int bandIndex = int(floor(t * float(numBands)));

    if (bandIndex % 2 == 0) {
        // Even bands are darker
        color *= 0.5;
    }

    return color;
}

highp vec3 terrestrialColor(highp float n) {
    const highp float diameterA = 0.1;
    const highp float diameterB = 0.1;

    // Calculate vertical and horizontal radii for ellipse
    highp float aRadius = diameterA / 2.0;
    highp float bRadius = diameterB / 2.0;

    // Calculate number of segments in s, given each diameter
    int numInS = int(vTexCoords.s / diameterA);
    int numInT = int(vTexCoords.t / diameterB);

    // Calculate horizontal and vertical centers of each segment, given the radius
    highp float sCenter = (float(numInS) * diameterA) + aRadius;
    highp float ds = vTexCoords.s - sCenter;
    highp float tCenter = (float(numInT) * diameterB) + bRadius;
    highp float dt = vTexCoords.t - tCenter;

    highp float dist = sqrt(ds * ds + dt * dt);
    highp float newDist = dist + n;
    highp float scale = newDist / dist;

    ds = ds * scale;
    dt = dt * scale;

    highp float left_half = abs(ds) / aRadius;
    highp float right_half = abs(dt) / bRadius;

    highp float d = pow(left_half, 2.0) + pow(right_half, 2.0);

    highp float t = smoothstep(1.0, 1.0, d);
    // Planet color for land color
    highp vec3 landColor = uFragColor.rgb;
    // Planet color, darkened for "water" color
    highp vec3 waterColor = landColor * 0.5;
    return mix(landColor, waterColor, t);
}



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

    // results
    highp vec3 ambient = STAR_AMBIENT * MATERIAL_DIFFUSE;
    highp vec3 diffuse = STAR_DIFFUSE * diff * MATERIAL_DIFFUSE;
    highp vec3 specular = STAR_SPECULAR * spec * MATERIAL_SPECULAR;

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    // c
    return ambient + diffuse + specular;
}

highp float makeNoise(highp float amp, highp float freq) {
    highp float uNoiseTexSliceFloat = float(uNoiseTexSlice);
    highp vec4 noiseTex = texture(uNoiseTex, freq*vec3(vTexCoords, uNoiseTexSliceFloat));
    highp float noise = noiseTex.r + noiseTex.g + noiseTex.b + noiseTex.a;
    noise = noise - 2.0;
    noise *= amp;
    return noise;
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
    highp vec3 planetColor = uFragColor.rgb;
    if (uMass >= THRESHOLD_GAS_GIANT) {
        // Gas giant
        planetColor = gasGiantColor(makeNoise(0.1, 0.25));
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