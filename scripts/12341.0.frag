#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.3;
	float sx = sin(p.x - -.322  * time - 4.30);
	float dy = 122.77 / ( 68.3 * abs(p.y  * sx * 8.) );
	dy += 0.2/ (521.  * length(p - vec2(p.x * .20 )));
	gl_FragColor = vec4( (p.x + 0.001) * dy, 0.2 * dy, p.y, .50 );

}