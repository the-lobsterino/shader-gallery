#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	vec2 p2 = gl_FragCoord.xy;
	//float color = 0.0;
	float x;
	float y;
	
	for(float i = 0.0; i < 25.0; i++) {
		x += p.x * cos(abs(p.y * p.x) + time) / p.x / i;
		y += p.y * sin(abs(p.x * p.y) / time) / p.y / i;
	}
	
	gl_FragColor = vec4( 0.25, x, y, 1);
}