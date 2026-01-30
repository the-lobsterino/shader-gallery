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
	p.y += mod( floor(p.x), 4.0) * 0.5;
	p = abs( fract(p)- 0.5 );
	return abs( max(p.x*1.5 + p.y, p.y * 2.0) - 1.0 ) ;
}

void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * aspect + vec2(tan(time), cos(time + sin(time))) * 0.5;
	uv *= 9.0;
	gl_FragColor = vec4( vec3(hex(uv) > 0.1 ? vec3(1.0, 1.0, 0.0) : vec3(1.0, 0.7, 0.2)), 1.0 );

}