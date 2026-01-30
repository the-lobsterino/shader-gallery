 #ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;

	p = p * 2.0 - 1.0;
	p.x*= resolution.x / resolution.y;
	
	vec2 m = vec2(0.0, 0.0);
	float r= sin(time * 10.0);
	m.x = cos(time * 2.0 * 1.0) * r;
	m.y = sin(time * 2.1 * 1.0) * r;
	float d = distance(m, p);
	float c = 1.0 - smoothstep(0.2, 0.21, d);
	vec3 color = vec3(4.0, 5.0, 0.0) * c;


	gl_FragColor = vec4( color, 1.0 );
}