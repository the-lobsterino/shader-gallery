// someone please make this shader with ones and hll
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{	
	vec2 p = gl_FragCoord.xy/2.-resolution/4.;
	p = vec2(floor(sqrt(length(p))*5.6/mouse.x)*mouse.x*10.,4.*atan(p.y,p.x));
	float c=-mod( p.y + (time*(.2+mod(p.x,4.5)/2.)), cos( p.x )), d=c*c*c*c*c;
	gl_FragColor = vec4( d,c,d,1 );
}