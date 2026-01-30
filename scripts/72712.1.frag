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
	
	vec2 U = floor( resolution/2.0 - gl_FragCoord.xy * surfacePosition );
	
	vec2 m = mouse * 2.0 - 1.0;
	
	float a = U.x; float b = U.y;
	
	// inspired by 'a journey in precision error' @ https://www.shadertoy.com/view/fssSDB 
	
	gl_FragColor = vec4( vec3( cos( a*b+dot(U*surfaceSize,m/U/1.6/surfacePosition) ) * 0.5 + 0.5 ), 1.0 );

}