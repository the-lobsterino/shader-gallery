#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex(vec2 p) {
	p = abs(p);
	return max(dot(p, vec2(.5, .86)), p.x);
}

void main() {

	vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);

	col += .01 / abs(hex(p) - 0.5);
	
	gl_FragColor = vec4(col, 1.);


}