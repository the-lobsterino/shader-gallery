#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec3 orientation;
uniform float time;
void main(void) {
    vec2 uv = gl_FragCoord.xy /
        min(resolution.x, resolution.y);

    uv = uv * 2.0 - 1.;

    vec3 uv3 = vec3(uv, 0.0);
    float a = time-(uv.x+uv.y);
    float ac = abs(cos(a-uv.y));
    float ac2 = mod(ac-uv.y, 0.2);
    float as = abs(sin(a-uv.x));
    float as2 = mod(ac2+uv.y, 0.2);
    uv3 *= mat3(
        ac, as, 0.0,
        -as, ac, 0.0,
        0.0, 0.0, 1.0);
    uv.x = uv3.x-uv.y;
    uv.y = uv3.y-uv.x;

    uv = mod(uv+(sqrt(abs(ac2*as2))+sqrt(abs(ac*as))), 0.9    ) * 2.0;

    gl_FragColor = vec4(uv, .5, .9);
}