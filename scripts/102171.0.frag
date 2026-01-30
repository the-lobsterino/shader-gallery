/*
 * Original shader from: https://www.shadertoy.com/view/sdlBWf
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Author: John Ao
// License: CC BY-NC 4.0

#define AA 16
#define eps .001
#define R .07
#define N_STEP 100

float sdf(vec3 p) {
    p = fract(p + .5);
    p = min(p, 1. - p);
    p *= p;
    return sqrt(p.x < p.y ? p.x + min(p.y, p.z) : p.y + min(p.x, p.z)) - R;
}

float sum3(vec3 x) {
    return x.x + x.y + x.z;
}

float max3(vec3 x) {
    return max(x.x, max(x.y, x.z));
}

float min3(vec3 x) {
    return min(x.x, min(x.y, x.z));
}

float cube_intersect(vec3 o, vec3 d) {
    vec3 a = 1. / d, b = -o * a, c = abs(a) * .5;
    float t1 = max3(b - c), t2 = min3(b + c);
    return 0. < t1 && t1 < t2 ? t1 : -1.;
}

float random2(vec2 seed) {
    return fract(1e3 * sin(seed.x * 12345. + seed.y) * sin(seed.y * 1234. + seed.x));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 cam = normalize(vec3(sin(iTime), cos(iTime), sin(iTime * .7 + 1.)));
    vec3 x_ = normalize(cross(vec3(0., 0., 1.), cam));
    vec3 y_ = cross(cam, x_);
    cam *= 3.;
    vec2 uv = vec2(0.);
    float col = 0.;
    for (int i = 0; i < AA; ++i) {
        uv = .8 * (2. * (fragCoord + vec2(random2(iTime * 1e-5 + uv), random2(iTime * 1e-4 + uv))) - iResolution.xy) / min(iResolution.x, iResolution.y);
        vec3 d = normalize(uv.x * x_ + uv.y * y_ - cam);
        float r = cube_intersect(cam, d);
        if (r > 0.) {
            float r_ = sdf(cam + r * d);
            if (r_ > eps) {
                r += r_;
                for (int j = 0; j < N_STEP; ++j) {
                    if (r_ <= eps) break;
                    r += r_ = sdf(cam + r * d);
                }
                col += pow(.7, sum3(abs(floor(cam + r * d + .5))));
            }
        } else {
            col += .3;
        }
    }
    fragColor = vec4(vec3(col / float(AA)), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}