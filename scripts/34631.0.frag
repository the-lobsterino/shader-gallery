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
	p.y += mod( floor(p.x), 4.) * 0.5;
	p = abs( fract(p)- 0.5 );
	return  abs(sin(max(sin(p.x*10.5 + p.y*5.+time*2.), sin(p.y * 5.0+time*2.)))+0.5); //abs( max(p.x*1.5 + p.y, p.y * 2.0) - 1.0 ) ;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;	
	gl_FragColor = vec4( vec3(1.-hex(uv*1.)*5.+2.), 1.0 );// *(sin(uv.x+time)+1.))

}