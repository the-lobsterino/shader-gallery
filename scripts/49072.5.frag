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
	vec3 C = vec3(c, c*(1.0 - abs(mod(_, 2.0) - 1.0)), 0.0);
	if (_ < 1.0) {
		C = vec3(C.x, C.y, C.z);
	} else if (_ < 2.0) {
		C = vec3(C.y, C.x, C.z);
	} else if (_ < 3.0) {
		C = vec3(C.z, C.x, C.y);
	} else if (_ < 4.0) {
		C = vec3(C.z, C.y, C.x);
	} else if (_ < 5.0) {
		C = vec3(C.y, C.z, C.x);
	} else {
		C = vec3(C.x, C.z, C.y);
	}
	return C + (v - c);
}

float map(vec3 p) {
	return 0.8 - length(p.xz);
}

float noise(vec2 co){
    return fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 cp = vec3(cos(time * 0.2), 0.0, sin(time * 0.45)) * 0.5;
	vec3 cl = vec3(-sin(time), 10.0, cos(time));
	vec3 cf = normalize(cl - cp);
	vec3 cs = normalize(cross(cf, vec3(sin(time * 0.1), 0.0, cos(time * 0.1))));
	vec3 cu = normalize(cross(cs, cf));
	float focus = 0.5;
	vec3 rd = normalize(cs * p.x + cu * p.y + cf * focus);
	vec3 rp = cp;
	for (int i = 1; i < 64; ++i) {
		float d = map(rp)+(0.1/float(i));
		if (d < 0.001)
			break;
		rp += (rd * d)*float(i*i*i*i+1);
	}
	float a = (atan(rp.z, rp.x)) * 16.0 / PI;
	float ai = floor(a);
	float af = fract(a);
	float d = (rp.y + 0.5 * time) * 10.0;
	float di = floor(d);
	float df = fract(d);
	float v = 64.0 * af * (1.0 - af) * df * (1.0 - df) * exp(-rp.y * 0.8);
	gl_FragColor = vec4(hsv(noise(vec2(ai, di) * 0.01), 1.0, v), 1.0);
}
