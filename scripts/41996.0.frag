#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 45

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	
	float sx = 0.1 * (p.x*p.x*20.0 + 0.8) * cos( 15.0 * p.x - 3. * pow(time*0.8, 0.9)*5.);
	
	float dy = 4./ ( 123. * abs(p.y - sx));
	
	dy += 8./ (160. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 0.1) * dy, 0.3 * dy, dy, 2.1 );

}