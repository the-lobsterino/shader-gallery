// someone please make this shader with ones and hll
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy) ;
	vec3 c;
	float g=p.y + (time);
	float f= cos( p.x ) + 0.04;
	g = -mod( g, f);
	c = vec3( 0.0, g, 0.0 );
	gl_FragColor = vec4( c, 1.0 );
}