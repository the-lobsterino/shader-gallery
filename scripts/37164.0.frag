#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
#define TWO_PI (2.0 * PI)

float udRoundBox(vec3 p, vec3 b_pos, vec3 b, float r) {
	return length(max(abs(p - b_pos) - b, 0.0)) - r;
}

float sdSphere(vec3 p, vec3 s_pos, float s_radius) {
	return length(p - s_pos) - s_radius;
}

float distFunc(vec3 pos) {
	//return sdSphere(pos, vec3(0.0, 0.0, 0.0), 1.0);
	return udRoundBox(pos, vec3(0.0, 0.0, 0.0), vec3(0.5, 0.5, 0.5), 0.1);
}

vec3 getNormal(vec3 pos) {
	float d = 0.001;
	return normalize(vec3(
		distFunc(pos) - distFunc(pos + vec3(d, 0.0, 0.0)),
		distFunc(pos) - distFunc(pos + vec3(0.0, d, 0.0)),
		distFunc(pos) - distFunc(pos + vec3(0.0, 0.0, d))
	));
}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 m = (mouse - 0.5) * 2.0;
	float cRadius = 3.0;
	
	vec3 cPos = vec3(0.0, 0.0, cRadius);
	// Z-X平面回転
	cPos.zx = mat2(cos(m.x*TWO_PI), -sin(m.x*TWO_PI), sin(m.x*TWO_PI), cos(m.x*TWO_PI)) * cPos.zx;
	// Y-Z平面回転
	cPos.yz = mat2(cos(m.y*TWO_PI), -sin(m.y*TWO_PI), sin(m.y*TWO_PI), cos(m.y*TWO_PI)) * cPos.yz;
	
	//vec3 cDir = vec3(0.0, 0.0, -1.0);
	//vec3 cUp = vec3(0.0, 1.0, 0.0);
	vec3 target = vec3(0.0, 0.0, 0.0);
	vec3 cDir = normalize(target - cPos);
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	cUp.yz = mat2(cos(m.y*TWO_PI), -sin(m.y*TWO_PI), sin(m.y*TWO_PI), cos(m.y*TWO_PI)) * cUp.yz;
	
	vec3 cSide = cross(cDir, cUp);
	float focus = 1.8;
	vec3 rayDir = normalize(
		cSide * p.x + cUp * p.y + cDir * focus
	);
	
	float t = 0.0, d;
	vec3 posOnRay = cPos;
	vec3 color = vec3(0.0);
	for (int i=0; i<64; i++) {
		d = distFunc(posOnRay);
		t += 0.75 * d;
		posOnRay = cPos + t * rayDir;
		if (abs(d) < 0.001) {
			vec3 normal = getNormal(posOnRay);
			float brightness = max(
				dot(normal, vec3(1.0, 1.0, -1.0)), 
				0.0
			) + 0.4;
			color = vec3(1.0) * brightness;
			break;
		}
	}
	gl_FragColor = vec4(color, 1.0);
}
