#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x += 0.15 * sin(p.x * p.y * 3.14 * 1.0 + time);
	p = mod(p, 0.12) / 0.12 - 0.5 + (mouse * 2.0 - 1.0) * 5.0;
	float x = sin(atan(p.y, p.x) * 8.0 - time * 2.0);
	float c = 1.0 / (1.0 + exp(-(x-0.25)*10.0)) - 1.0 / (1.0 + exp(-(x+0.25)*10.0));
	float color = pow(0.5 - c * 0.5 + 0.05, 3.0);
	color = 1.0 / (1.0 + exp(-color * sin(length(p) * 3.14 * 5.0 - time)));
	color = pow(color, 2.0);

	gl_FragColor = vec4( vec3( color ), 1.0 );

}