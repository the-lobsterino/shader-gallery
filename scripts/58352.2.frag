#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	float x = position.x - .1;
	float y = position.y - 1.;
	float r = 0.0;
	r += sin((pow(x + y * y, 10.) - time * 0.1) * 100.0 + sin(x * 10.123 + time)*1.0 + cos(y * 20.123 + time) * 1.0)  * 0.5 + 0.5;
	float g = 0.0;
	g += sin((pow(x + y * y, 0.1) - time * 0.06) * 90.0 + sin(x * 10.123 + time * 1.1)*1.0 + cos(y * 20.123 + time * 1.1) * 1.0)  * 0.5 + 0.5;
	float b = 0.0;
	b += sin((pow(x + y * y, 0.1) - time * 0.04) * 80.0 + sin(x * 10.123 + time * 1.2)*1.0 + cos(y * 20.123 + time * 1.2) * 1.0)  * 0.5 + 0.5;

	gl_FragColor = vec4( vec3(r, g, b), 1.0 );

}
