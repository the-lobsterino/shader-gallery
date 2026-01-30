// gtr quick code ;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (2.* gl_FragCoord.xy - resolution.xy )/resolution.y;

	float color = 0.5;
	color  = 2.2*length(fract(2.*sin( 2.*abs(p.x) - cos( p.y) * 2.0 *sin(time*0.28)) + cos(2.* abs(p.y) * sin( p.x*2.*sin(time*0.14) ) * 2.0 )) );
	color -= 0.6*length(fract(4.0*sin( 2.*abs(p.y) + cos( p.x) * 2.0 *sin(-time*0.28)) - cos(2.* abs(p.x) * sin( p.x*4.-sin(-time*0.14) ) * 2.0 )) );

	gl_FragColor = vec4( vec3( color*sin(time)+0.6, color*cos(time)-0.6, 0.2), 1.0 );

}