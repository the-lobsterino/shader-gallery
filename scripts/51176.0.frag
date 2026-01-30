#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float lin(vec2 p )
{
	p -= 0.5;
	
	float l = -abs(p.x) - abs(p.y) + 0.4;
	
	float t = step( 0.5, fract(p.x - time) );
	
	float c = abs(0.005 / l * t) - 0.2 * 3.;
		
	return c * t;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / min(resolution.x, resolution.y) ) / 1.0;

	gl_FragColor = vec4( vec3( lin(p) ), 1.0 );

}