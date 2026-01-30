#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 1.0
#define freq 2.0
#define amp 1.2
uniform vec2 mouse;
#define phase 10.0


void main( void ) {
	float x = (mouse.x-.5)*6.;
	float y = (mouse.y-.5)*3.;

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	

	float sx = (y)*0.8 * sin( 10.0 * (x) * (p.x-phase) - 5. * (speed)*time);
	
	float dy = 4./ ( 30. * abs(3.9*p.y - sx - 1.2));
	
	//dy += 1./ (60. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 0.4) * dy, 0.3 * dy, dy, 3.0 );
	

}