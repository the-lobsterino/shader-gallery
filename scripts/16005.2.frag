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

	float x = 0.1 * cos(time);
	float y = 0.2 * sin(time);
	float d = distance(vec2(x, y), p);
	float c = smoothstep(0.05, 0.051, d);
	

	gl_FragColor = vec4( c, c/2.0, c, 0.5 );

}