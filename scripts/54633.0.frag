#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(void)
{
    vec2 shenanigans = (gl_FragCoord.xy / resolution.xy);
    vec2 fr = fract(shenanigans.xy);
    float r = abs(sin(time * 0.2) * fr.y);
    float g = abs(sin(time * 0.5));
    float b = abs(sin(time * 2.3)* fr.x);
    gl_FragColor = vec4(r, g, b, 1.);
}