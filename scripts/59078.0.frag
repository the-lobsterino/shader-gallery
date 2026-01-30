#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 40.0
#define freq 1.0
#define amp 0.2
#define phase 5.0


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.4;
	
	float sx = (amp)*6.8 * sin( 6.0 * (freq) * (p.x-phase) - 5.8 * (speed)*time);
	
	float dy = 12./ ( 9. * abs(4.9*p.y - sx - 1.2));
	
	//dy += 1./ (60. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 5.9) * dy, 0.3 * dy, dy, 2.0 );
	

}