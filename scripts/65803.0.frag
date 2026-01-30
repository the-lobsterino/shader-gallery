#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 p = surfacePosition*2.;//( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
    	gl_FragColor = vec4(fract(vec3(p, dot(p,p))), 1.0);
}