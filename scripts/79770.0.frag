#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	float sx = 0.3 * (p.x + 0.8) * sin(900.0 * p.x * cos((time+p.y)*-0.04) - 1. * pow(time, 0.55)*5.);
	
	float dy = 4./ ( 5000. * abs(p.y/100. - sx/100.));
	
	dy += 1./ (25. * length(p - vec2(p.x, 9.)));
	
	gl_FragColor = vec4( (p.x + 0.1) * dy, 0.3 * dy, dy, 1.1 );

}