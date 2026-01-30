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
	
	float sx = (amp)*0.8 * sin( 10.0 * (freq) * (p.x+phase) * 1. * (speed)*time);
	
	float dy = 4./ ( 30. * abs(3.9*p.y - sx - 1.2));
	
	//dy += 1./ (60. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.y + 0.4) * dy, 0.3 * dy, dy, 1.0 );

}