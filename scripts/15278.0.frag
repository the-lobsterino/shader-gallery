#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec2 m = vec2(0, 0);
	float r = 0.5;
	m.x = r * cos(time * 5.0 * 1.2);
	m.y = r * sin(time * 5.0);
	
	float c = distance(m, p);
	c = 1.0 - smoothstep(0.05, 0.06, c);
	

	gl_FragColor = vec4( c, c, c, 1.0 );

}