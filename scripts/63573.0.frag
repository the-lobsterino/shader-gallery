#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.141592;
const float TAU = 2.0 * PI;

float fn( vec2 a, vec2 b )
{
	float v = cos( ( dot((b-a),(a-b)) * TAU ) );//*0.5+0.5;
	
	//v = 1.0-v*v;
	
	//v = cos( v + 1./dot(a,b) ) * 0.5 + 0.5;
	
	return v;
}

void main( void ) {
	
	vec2 p = surfacePosition - (mouse*2.0-1.0)/surfaceSize;// - surfaceSize/124.0;
	
	float v = fn( (p) , fract(gl_FragCoord.xy/65535.0) );
	
	//v = fract( v + 1./dot(surfacePosition,surfacePosition) );
	
	gl_FragColor = vec4( vec3( v ), 1.0 );
}