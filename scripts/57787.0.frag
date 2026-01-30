#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 1.
#define freq 1.
#define amp 1.0
#define phase 0.0


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	
	float sx = (amp)*9.8 * sin( 20.0 * (freq) * (p.x-phase) - 8. * (speed)*time);
	
	float dy = 5./ ( 40. * abs(4.0*p.y - sx - 1.4));
	
	//dy += 1./ (60. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 2.0) * dy, 10.0 * dy, dy, 1.0 );

}