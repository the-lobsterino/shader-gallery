#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define M_PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 less_angry_rainbow(float t, float gamma) {
    float h, l, a;

    t *= 2.0;
    if (t < 1.0) {
        h = 0.34907 + M_PI*t;
        l = pow(0.35 + 0.45*t, gamma);
        a = (0.75 + 0.75*t) * l * (1.0 - l);
    } else {
        t -= 1.0;
        h = 3.49066 + M_PI*t;
        l = pow(0.8 - 0.45*t, gamma);
        a = (1.5 - 0.75*t) * l * (1.0 - l);
    }

    return vec3(clamp(l + a*(-0.14861 * cos(h) + 1.78277 * sin(h)), 0.0, 1.0),
                clamp(l + a*(-0.29227 * cos(h) - 0.90649 * sin(h)), 0.0, 1.0),
                clamp(l + a*(+1.97294 * cos(h)), 0.0, 1.0));
}

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	gl_FragColor = vec4(less_angry_rainbow((0.3+sin(time))/position.x*position.y, 0.5 + 2.0*position.y), 1.0);
}
