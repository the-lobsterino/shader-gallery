#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy);

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;

	r = tan(time * 2.5);
	g = sin(tan(time * 1.25));
	b = tan(cos(time * 2.5));
	
	gl_FragColor = vec4(r * p.x, g * p.y, b, 1.0 );

}