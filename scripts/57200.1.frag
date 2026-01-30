#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	float t = fract(mouse.y * resolution.x + mouse.x);
	vec2 p = mix(gl_FragCoord.xy,surfacePosition,(fract(surfaceSize.x*surfaceSize.y)));
	float dp=(dot(p,p));
	float v = fract(dp+t+time);

	gl_FragColor = vec4( vec3( v ), 1.0 );

}