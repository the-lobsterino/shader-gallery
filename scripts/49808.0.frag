#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 180


void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	
	float sx = 0.3 * (p.x*p.x*87.0 - 1.7) * tan( 45.0 * p.y + 45. * pow(time/0.025, 0.06)*9.);
	
	float dy = 9./ ( 423. * abs(p.y - sx));
	
	dy += 30./ (11900. * length(p - vec2(p.x, 0.02
					 )));
	
	
	gl_FragColor = vec4( (p.x + 3.56
			     ) * dy, 0.3 * dy, dy, 1.1 );

}