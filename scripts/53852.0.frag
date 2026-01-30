#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float xx = sin(gl_FragCoord.x);
	float y = (0.698132 * xx) / resolution.y;
	
	vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
	vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
	vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
	float step1 = 0.0;
	float step2 = 0.33;
	float step3 = 0.66;
	float step4 = 1.0;
	
	vec4 color = mix(white, red, smoothstep(step1, step2, y));
	color = mix(color, blue, smoothstep(step2, step3, y));
	color = mix(color, green, smoothstep(step3, step4, y));

	gl_FragColor = color;

}