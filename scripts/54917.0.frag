#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 p) {
	return fract(45445.45 * (time * 0.000005) * sin(dot(p, vec2(45.65, time*0.01))));
}

void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	uv *= 8.0;
	vec2 f = 2.0 * fract(uv) - 1.0;
	vec2 i = floor(uv);
	col += smoothstep(0.18, 0.0, abs(length(f) - 0.1 - 0.8 * hash(i)));
	
	gl_FragColor = vec4(col, 1.);

}