#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

void main( void ) {
	vec3 color = vec3(0);
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	vec2 p = vec2(0.33, 0);
	const float r = 0.5;
	float t = time;
	if (distance(uv, p * rot(t + radians(  0.0))) < r) color += vec3(1, 0, 0);
	if (distance(uv, p * rot(t + radians(120.0))) < r) color += vec3(0, 1, 0);
	if (distance(uv, p * rot(t + radians(240.0))) < r) color += vec3(0, 0, 1);
	gl_FragColor = vec4(color, 1);
}
