//ziad, 2018

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 180


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	
	float sx = 0.7 * (p.x*p.x*2.0 - 0.7) * fract(cos( 45.0 * p.x - 15. * pow(time, 0.7)*9.));
	
	float dy = 30./ ( 180. * abs(p.x - (sx)));
	
	dy += 900./ (1500. * length(p - vec2(p.y, 0.0
					 )));
	
	dy *=fract(atan(dy));
	
	
	gl_FragColor = vec4( (p.x
			     ) * dy, 0.1 * dy, dy, 3.1 );

}