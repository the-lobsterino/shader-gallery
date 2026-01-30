#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;	
	float time = time + pow(cos(p.x*133.)*cos(p.x*133.), sin(p.y*55.)*sin(p.y*54.));
	p.y += sin(p.x+time)*0.5/p.x;	
	float sx = 0.3 * (p.x + 0.8) * sin( 25.0 * p.x - 0.01 * pow(time, 0.9)*10.);
	
	float dy;
	dy *= 3./ (20. * length(p - vec2(p.x,  1.8)));
	dy += 2./ (20. * length(p - vec2(p.x,  1.1)));	
	gl_FragColor = vec4( (p.x + 0.0) * dy, 2.0 * dy, dy, -0.01 );

}