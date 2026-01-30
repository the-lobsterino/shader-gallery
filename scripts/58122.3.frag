#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	float o = gl_FragCoord.y * resolution.x + gl_FragCoord.x;
	float q = floor(o) / floor(resolution.x * resolution.y);
	vec2 m = mouse * 2.0 - 1.0;
	vec2 p = surfacePosition;
	float dp = dot(p,p);
	float v =  cos(dp+m.x*m.y*dp+q*dp)*0.5+0.5;
	gl_FragColor = vec4( vec3(v), 1.0 );

}