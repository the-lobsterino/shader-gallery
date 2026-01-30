#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + mouse * .5 * sin(time);	

	float f = 15.*pow(p.x,5.)-8.*pow(p.y,32.)+13.*p.x-p.y;
	
	float color;
	color = sqrt(sin(f)-1./cos(f));

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 20.15 ), 1.0 );

}