#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float fn( float t, vec2 p )
{
	return cos( dot(p,p) * t + t ) * 0.5 + 0.5;
}

void main( void ) {
	
	float o = floor( gl_FragCoord.y * resolution.x + gl_FragCoord.x );
	float p = o / floor( resolution.x * resolution.y );
	float v0 = fn( p, surfacePosition / 2.0 );
	float v1 = fn( p, surfacePosition * 2.0 );
	float v = fract( (v1 + v0) / 2.0 );
	gl_FragColor = vec4( vec3( v ), 1.0 );

}