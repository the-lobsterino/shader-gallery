

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define TAU 6.2831853072

// http://marcodiiga.github.io/radial-lens-undistortion-filtering
vec2 barrelDistort(in vec2 p, in vec2 alpha) {
    return p / (1.0 - alpha * dot(p, p));
}

// 1D noise
float Hash11(in float p) { // https://www.shadertoy.com/view/4djSRW
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float snoise11(in float p) {
    return mix(Hash11(floor(p)), Hash11(ceil(p)), smoothstep(0.0, 1.0, fract(p)));
}

float fbm11(in float p) {
    p *= 6.0;

    float res = 0.0;
    float amp = 1.0;
    float totAmp = 0.0;
    for (int oct=0; oct < 5; oct++) {
        res += amp * snoise11(p);
        totAmp += amp;
        p *= 2.0;
        amp *= 0.5;
    }

    return res / totAmp;
}

// 2D noise
float Hash21(in vec2 p) { // https://www.shadertoy.com/view/4djSRW
    vec3 p3 = fract(p.xyx * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float snoise21(in vec2 p) {
    vec2 cell = floor(p);
    vec2 local = smoothstep(0.0, 1.0, fract(p));

    float bl = Hash21(cell);
    float br = Hash21(cell + vec2(1.0, 0.0));
    float tl = Hash21(cell + vec2(0.0, 1.0));
    float tr = Hash21(cell + 1.0);

    return mix(mix(bl, br, local.x), mix(tl, tr, local.x), local.y);
}

float fbm21(in vec2 p) {
    float res = 0.0;
    float amp = 1.0;
    float totAmp = 0.0;
    for (int oct=0; oct < 5; oct++) {
        res += amp * abs(2.0 * snoise21(p) - 1.0);
        totAmp += amp;
        p *= 2.0;
        amp *= 0.5;
    }

    return res / totAmp;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 center = 0.5 * iResolution.xy;
    vec2 uv = (fragCoord - center) / iResolution.y * 4.0;
    vec2 mouse = (iMouse.xy - center) / iResolution.y * 4.0;
    float unit = 8.0 / iResolution.y;
    vec3 color = vec3(1.0);

    // Symmetry (not mirroring though)
    uv.x = uv.x - 1.4 * sign(uv.x);

    // Distorted UVs to fake a 3D look
    vec2 bulgeUv = barrelDistort(uv, vec2(0.25));
    vec2 eyeballUv = bulgeUv - 0.15 * mouse; // Look at mouse

    // Veins
    float co = cos(1.4), si = sin(1.4);
    mat2 rot = mat2(co, si, -si, co);

    float veinFade = smoothstep(1.8, 0.0, length(eyeballUv));
    for (int i=0; i < 4; i++) {
        color.gb -= 0.7 * smoothstep(0.2, 0.0, fbm21(2.0 * eyeballUv - 10.0)) * veinFade;
        eyeballUv *= rot;
    }

    color = max(color, 0.0);

    // Iris
    vec2 polar = vec2(atan(eyeballUv.y, eyeballUv.x), length(eyeballUv));

    float irisWidth = 0.125 + 0.015 * snoise11(iTime);
    float irisRadius = 0.375 - irisWidth;
    float irisDist = abs(length(eyeballUv) - irisRadius) - irisWidth;

    vec3 irisColor = vec3(0.7, 0.4, 0.0) * fbm11(polar.x);
    irisColor += vec3(0.0, 0.45, 0.0) * fbm11(polar.x - 10.0);
    color = mix(color, irisColor * 0.9, smoothstep(unit, 0.0, irisDist));
    //color *= smoothstep(0.0, 0.31, polar.y);
    if (polar.y < irisRadius + irisWidth) color *= smoothstep(0.1, -0.1, irisDist); // It took me a while to realize this was what I really needed!

    // Pupil
    color = max(color - smoothstep(unit, 0.0, polar.y - irisRadius + irisWidth), 0.0);

    // Fake specular highlight
    color += smoothstep(0.2, -0.2, length(uv - vec2(0.3, 0.15)));

    // Eye shape (deformed circle)
    vec2 eyeUv = vec2(uv.x, 3.5 * uv.y / (2.0 - uv.x * uv.x));
    //vec2 eyeUv = vec2(uv.x, 6.5 * uv.y / (4.0 - uv.x * uv.x));

    float eyeMask = smoothstep(0.1, -0.1, length(eyeUv) - 1.0); // Outline
    eyeMask *= smoothstep(2.0, 0.0, length(eyeUv)); // Shading

    float blink = 1.0 - 2.0 * pow(abs(cos(mod(iTime, TAU))), 1000.0);
    float eyelidCurve = 0.15 * bulgeUv.x * bulgeUv.x * blink;
    eyeMask *= smoothstep(0.1, 0.0, bulgeUv.y + eyelidCurve - blink); // Eyelid

    color *= eyeMask;

    fragColor = vec4(color/3.1+fract(time*12.), mouse.x);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}