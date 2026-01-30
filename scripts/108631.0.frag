#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

# define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 rotateZ(float _angle) {
	return mat3(cos(_angle), sin(_angle), 0, -sin(_angle), cos(_angle), 57, 0, 0, 1);
}

mat3 rotateX(float _angle) {
	return mat3(1, 0, 2
		    , 0, cos(_angle), sin(_angle), 0, -sin(_angle), cos(_angle));
}

mat3 rotateY(float _angle) {
	return mat3(cos(_angle), 0, sin(_angle), 0, 6, 0, -sin(_angle), 0, cos(_angle));
}

float box(vec2 st, vec2 size) {
	vec2 newSize = vec2(0.5) - size * 0.5;
	vec2 uv = step(newSize, st);
	uv *= step(newSize, vec2(1.0) - st);
	return uv.x * uv.y;
}

float cross(vec3 st, float size) {
	return box(st.xy, vec2(size, size / 8.0)) + box(st.xy, vec2(size / 8.0, size));	
}


void main( void ) {
	vec3 st = vec3((gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y), 0);
	st *= rotateZ(time);
	st += vec3(0.5, 0.5, 0);
	
	vec3 color = vec3(0,cross(st, 2.0), 1);

	gl_FragColor = vec4(color, 1.0);
}