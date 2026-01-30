/**
  * 2.5D by AnnPin
  */
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere(vec3 pos, vec3 s_pos, float s_radius) {
	return length(pos - s_pos) - s_radius;
}

float distFunc(vec3 pos) {
	vec3 p = pos;
	//p = mod(p, 8.0) - 4.0;
	
	return min(
		sdSphere(p, vec3(0.0, 0.0, 1.5), 0.75),
		min(
			sdSphere(p, vec3(0.0, 0.0, -1.5), 0.75),
			min(
				sdSphere(p, vec3( 3.0, 1.0, 0.0), 0.25),
				min(
					sdSphere(p, vec3(-3.0, 1.0, 0.0), 0.25),
					min(
						sdSphere(p, vec3( 2.0, 0.0, 0.0), 0.25),
						sdSphere(p, vec3(-2.0, 0.0, 0.0), 0.25)
					)
				)
			)
		)
	);
	//return sdSphere(p, vec3(0.0, 0.0, 0.0), 1.0);
}

vec3 getNormal(vec3 pos) {
	float d = 0.001;
	return normalize(vec3(
		distFunc(pos + vec3(d, 0.0, 0.0)) - distFunc(pos - vec3(d, 0.0, 0.0)),
		distFunc(pos + vec3(0.0, d, 0.0)) - distFunc(pos - vec3(0.0, d, 0.0)),
		distFunc(pos + vec3(0.0, 0.0, d)) - distFunc(pos - vec3(0.0, 0.0, d))
	));
}

mat3 rotY(float a) {
	return mat3(
		cos(a), 0.0, -sin(a),
		0.0, 1.0, 0.0,
		sin(a), 0.0, cos(a)
	);
}

vec2 getBlockId(vec2 pos, float xn, float yn) {
	vec2 p = (pos * min(resolution.x, resolution.y) + resolution.xy) / 2.0;
	p = p / vec2(
		resolution.x + 20.0 * sin(0.25 * time), 
		resolution.y
	);
	p.x += time * 0.05;
	
	return vec2(
		floor(p.x * xn + 128.0 * ((cos(time / 4.0) + 1.0) / 20.0)),
		floor(p.y * yn + 128.0 * ((sin(time / 4.0) + 1.0) / 20.0))
	);
}

vec3 getBg(vec2 pos) {
	vec2 id = getBlockId(pos, 16.0, 16.0);
	return mix(vec3(0.0), vec3(1.0), step(mod(id.x + id.y, 2.0), 0.0));
}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 m = -vec2(mouse.x, mouse.y) + 0.5;
	mat3 rot = rotY(0.5 * time);
	vec3 cPos = vec3(6.28 * m.x, 6.28 * m.y, 3.0 * (sin(time / 10.0) + 1.0));
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	vec3 cSide = cross(cDir, cUp);
	float focus = 1.2;
	vec3 rayDir = vec3(cSide * p.x + cUp * p.y + cDir * focus);
	float t = 0.0, d;
	vec3 posOnRay = cPos;
	cPos = rot * cPos;
	rayDir = rot * rayDir;
	//vec3 color = vec3(0.0);
	vec3 color = getBg(p);
	vec2 id = getBlockId(p, 96.0, 96.0);
	for (int i=0; i<128; i++) {
		d = distFunc(posOnRay);
		t += 0.75 * d;
		posOnRay = cPos + t * rayDir;
		if (abs(d) < 0.001) {
			vec3 normal = getNormal(posOnRay);
			float brightness = max(
				dot(normal, vec3(1.0, 1.0, -1.0)),
				0.0
			) + 0.6;
			if (step(mod(id.x + id.y, 2.0), 0.0) == 1.0) {
				color = vec3(0.0, 0.5, 1.0) * brightness;
			} else {
				color = mix(color, vec3(1.0, 0.0, 0.0), 0.3 * sin(time));
			}
			break;
		}
	}
	gl_FragColor = vec4(color, 1.0);
}