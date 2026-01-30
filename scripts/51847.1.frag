#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define speed 0.3
#define freq 0.62
#define amp 0.70
#define phase 0.0


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	
	float sx = (amp)*1.0 * sin( 10.0 * sin(p.y*5.1*freq) * (p.x-phase) - (10.) * (sin(p.y*0.5*p.x*0.005)+speed)*time);
	
	float dy = 1./ ( 30. * abs(3.9*p.y - sx - 1.0));
	
	gl_FragColor = vec4( (1.0) * sin(time+dy*sx)*0.2, 0.95 * dy, dy, 1.0 );

}