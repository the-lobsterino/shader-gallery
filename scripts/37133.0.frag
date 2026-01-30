#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// union / subtraction

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere(vec3 pos, vec3 s_pos, float s_radius) {
	return length(pos - s_pos) - s_radius;
}

float sdCone(vec3 pos, vec3 c_pos, vec2 c) {
	vec3 p = pos - c_pos;
	float q = length(p.xy);
	return dot(c, vec2(q, p.z));
}

float udRoundBox(vec3 pos, vec3 b_pos, vec3 b, float r) {
	vec3 p = pos - b_pos;
	return length(max(abs(p) - b, 0.0)) - r;
}

float distFunc(vec3 pos) {
	pos = mod(pos, 8.0) - 4.0;
	float r = 0.33; + 0.1 * (sin(time * 3.14) + 1.0) / 2.0;;
	return max(
		udRoundBox(pos, vec3(0.0, 0.0, 0.0), vec3(0.25, 0.25, 0.25), 0.025),
		-min(
			sdSphere(pos, vec3(r, 0.0, 0.0), 0.25),
			min(
				sdSphere(pos, vec3(-r, 0.0, 0.0), 0.25),
				min(
					sdSphere(pos, vec3(0.0, 0.0, r), 0.25),
					min(
						sdSphere(pos, vec3(0.0, 0.0, -r), 0.25),
						min(
							sdSphere(pos, vec3(0.0,  r, 0.0), 0.25),
							sdSphere(pos, vec3(0.0, -r, 0.0), 0.25)

						)
					)
				)
			)
		)
	);
}

vec3 getNormal(vec3 pos) {
	float d = 0.001;
	return normalize(vec3(
		distFunc(pos) - distFunc(pos + vec3(d, 0.0, 0.0)),
		distFunc(pos) - distFunc(pos + vec3(0.0, d, 0.0)),
		distFunc(pos) - distFunc(pos + vec3(0.0, 0.0, d))
	));
}

mat3 rotY(float a) {
	return mat3(
		cos(a), 0.0, -sin(a),
		0.0, 1.0, 0.0,
		sin(a), 0.0, cos(a)
	);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 m = mouse * 2.0 - 1.0;
	
	mat3 rot = rotY(10.0 * (sin(time / 10.0) + 1.0) / 2.0);
	
	vec3 cPos = vec3(0.0, 0.0, 50.0);
	vec3 cDir = vec3(-m.x, -m.y, -1.0);
	vec3 cUp= vec3(0.0, 1.0, 0.0);
	vec3 cSide = cross(cDir, cUp);
	float focus = 2.0;
	
	vec3 rayDir = normalize(p.x * cSide + p.y * cUp + focus * cDir);
	float t = 0.0, d;
	vec3 posOnRay = cPos;
	
	vec2 q = floor(p * 5.0) / 5.0;
	vec3 color = vec3(q.x, q.y, sin(time));
	
	cPos = rot * cPos;
	rayDir = rot * rayDir;
	
	for (int i=0; i<64; i++) {
		d = distFunc(posOnRay);
		t += 0.75 * d;
		posOnRay = cPos + t * rayDir;
		
		if (abs(d) < 0.001) {
			vec3 normal = getNormal(posOnRay);
			float brightness = max(
				dot(vec3(1, 1, 1), normal),
				0.0
			) + 0.4;
			color = vec3(1.0, 0.5, 0.0) * brightness;
		}
	}
	gl_FragColor = vec4(color, 1.0);
}