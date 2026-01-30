#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float tim;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	vec3 col = mix(vec3(.1, .3, 1.),vec3(1., .9, .3), step(position.y, 0.5));	

	gl_FragColor = vec4(col, 1.);
}