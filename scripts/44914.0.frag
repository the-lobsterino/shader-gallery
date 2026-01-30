
// A simple, if a little square, water caustic effect.
// David Hoskins.
// htthttps://www.shadertoy.com/view/MdKXDmps://www.shadertoy.com/view/MdKXDm
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Inspired by akohdr's "Fluid Fields"
// https://www.shadertoy.com/view/XsVSDm

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define f length(fract(q*=m*=.6+.1*d++)-.5)
void main()
{
    float d = 0.;
    vec3 q = vec3(gl_FragCoord.xy / resolution.yy-13., time*.02);
    mat3 newM = mat3(-1,1,1,-1,1,1,1,1,-1);
    mat3 m = mat3(-2,-1,2, 3,-2,1, -1,1,time*.02);
    m = m * newM;
    vec3 col = vec3(pow(min(min(f,f),f), 7.)*40.);
    gl_FragColor = vec4(clamp(col + vec3(0.23, 0.0, 0.2), 0.0, 1.0), 1.0);
}
