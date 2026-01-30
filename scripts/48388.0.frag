#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /
       min(resolution.x, resolution.y);
    gl_FragColor = vec4(p, 0., 0.0);
}
