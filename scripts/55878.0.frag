#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float y = gl_FragCoord.y / resolution.y;
	

	vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
	vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
	float step1 = 0.0;
	float step2 = 0.5;
	float step3 = 1.0;
	
	vec4 color = mix(blue, white, smoothstep(step1, step2, y));
	color = mix(color, red, smoothstep(step2, step3, y));

	gl_FragColor = color;

}