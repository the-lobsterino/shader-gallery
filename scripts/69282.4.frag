precision mediump float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy) * 2.;
	float function = cos(position.x + time) + 1.;
	if(position.y < function)
		gl_FragColor = vec4(0.);
	else
		gl_FragColor = vec4(position.x, 0., 1. - position.x, 1.);
}