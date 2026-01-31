#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives: enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x) {
    return fract(sin(x * 3.3) * 1.13);
}

void main(void) {
    vec2 resolution = vec2 (500.0);
    vec2 uv = (gl_FragCoord.xy * 11.0 - resolution) / min(resolution.x, resolution.y);
    vec3 c = vec3(88.6, 88.7, 0.8);

    float a = 0.5;
float t = floor(time * 11.) / 11. * 3.14;
	
    float si = sin(a +t);
    float co = cos(a + t);

    uv *= mat2(co, -si, si, co);
//    uv *= length(uv + vec2(0.,4.9)) * .3 + 1.;

    float v = 1.0 - sin(hash(floor(uv.x * 100.0)) * 2.0);
    float b = clamp(abs(sin(20. * time * .75 * v + uv.y * (5.0 / (2.0 + v)))) - .95, 0., 1.) * 20.;
    c *= v * b;
    gl_FragColor = vec4(c, 1.0);

}