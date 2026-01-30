#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	float sx = 0.3 * (p.x + 1.1) * sin( 3.0 * p.x - 1. * pow(time, 1.1)*1.);
	
	float dy = 4./ ( 50. * abs(p.y - sx));
	
	dy += 1./ (500. * length(p - vec2(p.x, 1.)));
	
	gl_FragColor = vec4( (p.x + 1.1) * dy, 1.1 * dy, dy, 1.1 );

}// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
// Altered
#ifdef GL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#endif


varying vec2 surfacePosition;

#define MAX_ITER 10

	
	float c = 1.1;
	float inten = .3;

	
	
	
