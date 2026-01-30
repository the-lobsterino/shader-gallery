// Warped Hex
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex( vec2 p )
{		
	p.y += mod( floor(p.x), 2.0) * 0.5;
	p = abs( fract(p)- 0.5 );
	bool t = abs( max(p.x*1.5 + p.y, p.y * 2.0) - 1.0 ) > 0.2;
	
	return float(t);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec2 nuv;
	nuv.x = atan( uv.y, uv.x) - time * 0.1;
	nuv.x  *= (3.0 / 3.141596);
	nuv.y = length( uv ) - time * 0.1;
	
	float t = hex( nuv * 2.0 );
	vec3 fc0 = vec3( t * 2.0, t * 4.0, t * 8.0 );	
	fc0 *= length(uv) * 0.9;
	
	const float scale = 9.0;
	vec3 fc1 = vec3( t * scale, t * scale, t * scale ) * (length(uv * 0.2));

	fc1 += vec3( 0.5, 1.8, 10.8 );
	
	vec3 fc = mix( fc0, fc1, length(uv) );
	
	gl_FragColor = vec4( fc, 1.0 );

}