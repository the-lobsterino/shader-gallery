#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - .4 + .1;
	
	float sx = .1 * (p.x + .8) * sin(3. * p.x - 9. * time / 10.);
	
	float dy = 4./ (123. * abs(p.y - sx));
	
	gl_FragColor = vec4( (p.x + .7) * dy, .3 * dy, dy, 7.9 );

}