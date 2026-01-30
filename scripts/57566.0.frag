#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 0.5
#define freq 6.0	
#define amp 0.3
#define phase 3.0

//Let's make some friends
// https://github.com/Allakazan

// I love you guys <3


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.3;
	
	float sx = (amp)*1.9 * sin( 4.0 * (freq) * (p.x-phase) - 6.0 * (speed)*time)*sqrt((p.x+0.3)*time*0.6);
	
	float dy = 43./ ( 60. * abs(4.9*p.y - sx - 1.));
	
	gl_FragColor = vec4( (p.x + 0.05) * dy, 0.2 * dy, dy, 2.0 );
	

}
