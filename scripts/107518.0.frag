precision highp float;
#define GLSLIFY 1

const vec2 resolution = vec2(400.0, 400.0);

const float time = 0.001;
const vec2 mousePosition = vec2(0.5, 0.5);

const float transitionProgress = 0.5;

const vec2 colorPosition1 = vec2(0.1, 0.2);
const vec2 colorPosition2 = vec2(0.3, 0.4);
const vec2 colorPosition3 = vec2(0.5, 0.6);

// intro
const vec3 introColor1 = vec3(0.1, 0.2, 0.3);
const vec3 introColor2 = vec3(0.4, 0.5, 0.6);
const vec3 introColor3 = vec3(0.7, 0.8, 0.9);
const vec3 introColor4 = vec3(0.2, 0.3, 0.4);
const vec3 introColor5 = vec3(0.47, 0.1, 0.64);
const vec3 introColor6 = vec3(0.03, 0.46, 0.87);

const float introBrightness = 0.5;
const float introContrast = 1.0;
const float introBlend = 0.5;
const float introBlendModifier = 0.8;
const float introNoiseStrength = 0.2;

// content
const vec3 contentColor1 = vec3(0.2, 0.3, 0.4);
const vec3 contentColor2 = vec3(0.5, 0.6, 0.7);
const vec3 contentColor3 = vec3(0.8, 0.9, 1.0);
const vec3 contentColor4 = vec3(0.1, 0.2, 0.3);
const vec3 contentColor5 = vec3(0.4, 0.5, 0.6);
const vec3 contentColor6 = vec3(0.7, 0.8, 0.9);

const float contentBrightness = 0.5;
const float contentContrast = 1.0;
const float contentBlend = 0.5;
const float contentBlendModifier = 0.5;
const float contentNoiseStrength = 0.2;

// float brightness.    default:   0.0
// float contrast.      default:   1.0
vec3 brightnessContrast(vec3 value, float brightness, float contrast) {
    return (value - 0.5) * contrast + 0.5 + brightness;
}

// pseudo random
float random(vec2 p) {
    vec2 k1 = vec2(23.14069263277926, 2.665144142690225);

    return fract(cos(dot(p, k1)) * 12345.6789);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy; // 0 ... 1
    vec2 _mousePosition = vec2((mousePosition.x + 1.0) / 2.0, (mousePosition.y + 1.0) / 2.0); // 0 ... 1

    // COLORS
    vec3 colors[4];
    colors[0] = mix(introColor1 / 255.0, contentColor1 / 255.0, transitionProgress);
    colors[1] = mix(introColor2 / 255.0, contentColor2 / 255.0, transitionProgress);
    colors[2] = mix(introColor3 / 255.0, contentColor3 / 255.0, transitionProgress);

    vec3 color4 = mix(introColor4 / 255.0, contentColor4 / 255.0, transitionProgress);
    vec3 color5 = mix(introColor5 / 255.0, contentColor5 / 255.0, transitionProgress);
    vec3 color6 = mix(introColor6 / 255.0, contentColor6 / 255.0, transitionProgress);

    float xWithEasing = uv.x;

    if(xWithEasing < 0.5) {
        colors[3] = mix(color4, color6, ((xWithEasing * 2.0)));
    } else {
        colors[3] = mix(color6, color5, (((xWithEasing - 0.5) * 2.0)));
    }

    // COLOR POSITIONS
    vec2 colorPositions[3];
    colorPositions[0] = colorPosition1;
    colorPositions[1] = colorPosition2;
    colorPositions[2] = _mousePosition;

    // NON COLOR UNIFORMS
    float blend = mix(introBlend, contentBlend, transitionProgress);
    float blendModifier = mix(introBlendModifier, contentBlendModifier, transitionProgress);
    float brightness = mix(introBrightness, contentBrightness, transitionProgress);
    float contrast = mix(introContrast, contentContrast, transitionProgress);
    float noiseStrength = mix(introNoiseStrength, contentNoiseStrength, transitionProgress);

    // blend
    blend = blend + (sin(time) * blendModifier);

    // calculate IDW (Inverse Distance Weight) interpolation
    vec3 sum = vec3(0.0);
    float valence = 0.0;
    for(int i = 0; i < 3; i++) {
        // 0 ... 1
        float distance = length(uv - colorPositions[i]);
        if(distance == 0.0) {
            distance = 1.0;
        }

        float w = 1.0 / pow(distance, blend);
        sum += w * colors[i];
        // sum = mix( sum, colors[i], ( 1.0 - distance ) );
        valence += w;
    }
    sum = sum / valence;

    // apply gamma 2.2
    sum = pow(sum, vec3(1.0 / 2.2));

    // post processing
    sum = brightnessContrast(sum, brightness, contrast);

    // add noise
    vec2 uvRandom = uv;
    uvRandom.y *= random(vec2(uvRandom.y, time));
    sum.rgb += random(uvRandom) * noiseStrength;

    // output
    gl_FragColor = vec4(sum.xyz, 1.0);
}