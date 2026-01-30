#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, -s, s, c);
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 color = vec3(0.9);
	uv *= rotate(time * .5);
	uv = abs(uv);
	vec2 ar = vec2(atan(uv.x, uv.y), length(uv));
	color = mix(color, vec3(.4, 0., .7), sin(8. * (ar.y * 1. - time) + time) + (8. * ar.x - 8. * ar.y));
	color /= mix(color, vec3(.7, .2, 0.), cos(8. ) * (5. * ar.y - 8. * ar.x));	
	gl_FragColor = vec4(color, 1.);
}