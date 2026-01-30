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
	
	vec2 p = (  surfacePosition );
	
	//float d = dot(p,p);
	
	//p /= 1. - length(p);//sqrt(d);
	
	float f = fract((p.x*p.y)*0.123456789);
	
	gl_FragColor = vec4( vec3( f ), 1.0 );

}