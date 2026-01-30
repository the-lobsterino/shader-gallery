#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 st, float r) {
	st = st - vec2(0.5);
	st = mat2(cos(r), -sin(r), sin(r), cos(r)) * st;
	return st + vec2(0.5);
}

vec2 tile(vec2 st, float z) {
	return fract(st * z);
}

float square(vec2 st, float size) {
	st = abs(st - vec2(0.5));
	return 1.0 - step(size, max(st.x, st.y));
}

void main(){
    vec2 pos = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);
    vec2 st = tile(pos, 5.0);
	st = rotate(st, 45.0 * 3.141592 / 180.0);
    color = square(st, 0.35) * vec3(cos(sin(time) * mod(floor(pos.x * 20.0), 5.0)) / 2.0 + 0.5, sin(cos(time) * mod(floor(pos.y * 10.0) , 5.0)) / 2.0 + 0.5, (pow(tan(time * mod((pos.x + pos.y) * 5.0, 10.0)), 2.0)));
    gl_FragColor = vec4(color,1.0);
}