#ifdef GL_ES
precision highp float;
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
	float v = cos( ( dot((b-a),(a-b)) * TAU  ) );//*0.5+0.5;
	
	v = 1.0-v*v;
	
	v = cos( v * dot(a,b) ) * 0.5 + 0.5;
	
	//v = fract( v );
	
	return v;
}

void main( void ) {
	
	float v = fn( fract(surfacePosition*16.0) * 2.0 - 1.0 , (gl_FragCoord.xy/(256.0 * (mouse.x*mouse.y))) );
	
	//v = fract( v + 1./dot(surfacePosition,surfacePosition) );
	
	gl_FragColor = vec4( vec3( v ), 1.0 );
}