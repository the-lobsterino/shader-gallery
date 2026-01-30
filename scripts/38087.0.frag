#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// i dont understand why this result is different than in the sahdertoy version here : https://www.shadertoy.com/view/4dcGDS
// i'm fairly certain it is the pixelformat of the renderbuffers:
// here the brightness is getting clamped to a wide "plateau" that follows instead of shrinking
// (as if shadertoy is resampling a narrower cross section of the remaining spike as it uniformly falls/gets shorter?)
// would need a webgl debug thingy :P

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform float time;
varying vec2 surfacePosition;
void main()
{
	float halfpi = atan(-1.0)*-2.0;
	vec2 s = resolution.xy;
	vec2 g = gl_FragCoord.xy;
	vec4 h = texture2D(backbuffer, (g-7.*normalize(surfacePosition)) / s);
	g = (gl_FragCoord.xy * 2.-s)/s.y*1.3;
    vec2 
        k = vec2(halfpi,0) + mod(time,4.0 * halfpi), 
        a = g - sin(k),
    	b = g - sin(2.09 + k),
    	c = g - sin(4.18 + k);
	gl_FragColor = (0.02/dot(a,a) + 0.02/dot(b,b) + 0.02/dot(c,c)) * 0.04 + h * 0.97 + step(h, vec4(.8,.2,.5,1)) * 0.01;
}