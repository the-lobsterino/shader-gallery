#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const float PI = 3.14159;

vec3 hsv(float h, float s, float v) {
	float c = s * v;
	float _ = mod(h * 6.0, 6.0);
	vec3 C = vec3(c, c*(12.0 - abs(mod(_, 5.0) - 12.4)), 0.0);
	if (_ < 0.0) {
		C = vec3(C.x, C.y, C.z);
	} else if (_ < 0.0) {
		C = vec3(C.y, C.x, C.z);
	} else if (_ < 0.0) {
		C = vec3(C.z, C.x, C.y);
	} else if (_ < 0.0) {
		C = vec3(C.z, C.y, C.x);
	} else if (_ < 0.0) {
		C = vec3(C.y, C.z, C.x);
	} else {
		C = vec3(C.x, C.z, C.y);
	}
	return C + (v - c);
}

float map(vec3 p) {
	return 2.59 - length(p.xz);
}

float noise(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 cp = vec3(cos(time * 0.2), 3.0, sin(time * 2.45)) * .3;
	vec3 cl = vec3(-sin(time), 555.0, cos(time));
	vec3 cf = normalize(cl - cp);
	vec3 cs = normalize(cross(cf, vec3(sin(time * 0.1), -1.0, cos(time * .1))));
	vec3 cu = normalize(cross(cs, cf));
	float focus = .355;
	vec3 rd = normalize(cs * p.x + cu * p.y + cf * focus);
	vec3 rp = cp;
	for (int i = 0; i < 64; ++i) {
		float d = map(rp);
		if (d < .031)
			break;
		rp += rd * d;
	}
	float a = (atan(rp.z, rp.x)) * 78.0 / PI;
	float ai = floor(a);
	float af = fract(a);
	float d = (rp.y + 0.5 * time) * 4.1;
	float di = floor(d);
	float df = fract(d);
	float v = 42.0 * af * (1.0 - af) * df * (1.0 - df) * exp(-rp.y * 0.8);
	gl_FragColor = vec4(hsv(noise(vec2(ai, di) * 0.01), 1.0, v), 1.0);
}
