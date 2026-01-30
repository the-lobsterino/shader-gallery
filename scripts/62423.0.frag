//
// 8bit monster's sailing
// ======================
//
// 2018/12/01
// Tokyo Demo Fest
//

// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float circle(vec2 p, float r, vec2 q) {
    return length(p - q) - r;
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;

    // Repeat
    // p *= 2.;
    // p = mod(p, 1.) * 2. - 1.;

    // Lower resolution
    p = p - mod(p, 16. / 640.);

    // Dolly
    p *= 1. + ((cos(time) + 1.) / 2.);

    // Monster
    for (int i = 7; i >= 0; --i) {
        float tm = time - float(7 - i) * 0.05;
        vec2 pos = p + vec2(cos(tm * 2.), sin(tm * 1.5));
        pos.x += 0.1 * cos(p.y * 20.);
        float len = length(pos);
        if (len < 0.01 + ((cos(tm) + 1.) / 2.)) {
            gl_FragColor = vec4(hsv(mod(len - tm, 1.), 1. - 0.1 * float(7 - i), 1.), 1.0);
            return;
        }
    }

    // Sea
    if (p.y < - 0.6) {
        vec3 c1 = vec3(0., 123., 174.) / 255.;
        vec3 c2 = vec3(0., 159., 255.) / 255.;
        float t = (p.y - (-0.6)) / -0.4;
        if (cos(t * PI * (5. - t*1.1)) > 0.) gl_FragColor = vec4(c1, 1.);
        else gl_FragColor = vec4(c2, 1.);
        return;
    }

    // Cloud
    float dx = 2. - mod(time / 4., 4.);
    if (circle(vec2(dx + 0.20, 0.70), 0.05, p) <= 0. ||
        circle(vec2(dx + 0.10, 0.75), 0.15, p) <= 0. ||
        circle(vec2(dx + 0.00, 0.65), 0.15, p) <= 0. ||
        circle(vec2(dx + 0.15, 0.65), 0.15, p) <= 0.) {
        gl_FragColor = vec4(255., 255., 255., 255.) / 255.;
        return;
    }
    dx = 2. - mod(time / 6. + 1., 4.);
    if (circle(vec2(dx + 0.2, 0.65), 0.10, p) <= 0. ||
        circle(vec2(dx + 0.2, 0.50), 0.15, p) <= 0. ||
        circle(vec2(dx + 0.1, 0.50), 0.05, p) <= 0. ||
        circle(vec2(dx + 0.1, 0.55), 0.15, p) <= 0.) {
        gl_FragColor = vec4(255., 255., 255., 255.) / 255.;
        return;
    }

    // Sky
    gl_FragColor = vec4(0., 206., 235., 255.) / 255.;
}
