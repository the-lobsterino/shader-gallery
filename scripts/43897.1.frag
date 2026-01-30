#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float smine(float a, float b) {
	const float k = 4.0;
	float res = exp(-k * a) + exp(-k * b);
	return -log(res) / k;
}

float sminp(float a, float b) {
	const float k = 0.025;
	float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	return mix(b, a, h) - k * h * (1.0 - h);
}

float opU (float d1, float d2) {
	return min(d1, d2);
}

vec3 opRep (vec3 p, vec3 c) {
	return mod(p, c)- 0.5 * c;
}

vec3 opTwist (vec3 p, float a) {
	float c = cos(a * p.y + a);
	float s = sin(a * p.y + a);
	mat2 m = mat2(c, -s, s, c);
	return vec3(m * p.xz, p.y);
}

vec3 opRotateX (vec3 p, float t) {
	float c = cos(t);
	float s = sin(t);
	mat2 m = mat2(c, -s, s, c);
	return vec3(p.x, m * p.yz);
}

vec3 opRotateY (vec3 p, float t) {
	float c = cos(t);
	float s = sin(t);
	mat2 m = mat2(c, -s, s, c);
	vec2 tmp = m * p.xz;
	return vec3(tmp.x, p.y, tmp.y);
}

vec3 opRotateZ (vec3 p, float t) {
	float c = cos(t);
	float s = sin(t);
	mat2 m = mat2(c, -s, s, c);
	return vec3(m * p.xy, p.z);
}

float dSphere (vec3 p, float r) {
	return length(p) - r;
}

float dBox (vec3 p, vec3 b, float r) {
	return length(max(abs(p) - b + r, 0.0)) - r;
}

float dTorus (vec3 p, vec2 t) {
	vec2 q = vec2(length(p.xz) - t.x, p.y);
	return length(q) - t.y;
}

float dHexPrism (vec3 p, vec2 h) {
	vec3 q = abs(p);
	return max(q.z - h.y, max((q.x * 0.866025 + q.y * 0.5), q.y) - h.x);
}

float distance (vec3 p) {
	
	//p.y += time;
	//p = opRep(p, vec3(10.0, 10.0, 10.0));
	//p = opRotateX(p, time * 3.14159 * 0.1);
	//p = opRotateZ(p, time * 3.14159 * 0.1);
	
	// Infinity
	float d = 1.0 / 0.0;

	d = opU(d, dTorus(p, vec2(1.5, 0.5)));
	
	// Bolt
	//d = opU(d, dHexPrism(opRotateX(p, 3.14159 / 2.0) - vec3(0.0, 0.0, -0.75), vec2(0.5, 0.125)));
	//d = opU(d, dHexPrism(opTwist(p, -16.0), vec2(0.25, 0.75)));
	
	return d;
}

vec3 getNormal (vec3 p) {
	const float d = 0.0001;
	return normalize(
		vec3(
			distance(p + vec3(d  , 0.0, 0.0)) - distance(p - vec3(d  , 0.0, 0.0)),
			distance(p + vec3(0.0, d  , 0.0)) - distance(p - vec3(0.0, d  , 0.0)),
			distance(p + vec3(0.0, 0.0, d  )) - distance(p - vec3(0.0, 0.0, d  ))
		)
	);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

	vec3 camPos = vec3(-4.0, 4.0, 4.0);
	vec3 camLookAt = normalize(vec3(0.0));
	vec3 camDir = normalize(-(camPos + camLookAt));
	vec3 camUp = vec3(0.0, 1.0, 0.0);
	vec3 camSide = cross(camDir, camUp);
	float focus = 1.8;
	vec3 rayDir = normalize(vec3(camSide * p.x + camUp * p.y + camDir * focus));
	
	float t = 0.0;
	float d = 0.0;
	
	vec3 posOnRay = camPos;
	
	for (int i = 0; i < 64; i++) {
		d = distance(posOnRay);
		t += d;
		posOnRay = camPos + t * rayDir;
	}
	
	vec3 normal = getNormal(posOnRay);
	
	vec3 lightPos = vec3(5.0 * cos(time), 2.0, 5.0 * sin(time));
	//vec3 lightPos = vec3(5.0, 1.0, -5.0);
	vec3 lightDir = normalize(-lightPos);
	float lightInt= 5.0;
	vec3 objColor = vec3(0.25, 0.5, 1.0);
	
	float surfaceInt = (0.5) * lightInt * dot(-lightDir, normal);
	
	if (abs(d) < 0.001) {
		gl_FragColor = vec4(surfaceInt * objColor, 1.0);
		//gl_FragColor = vec4(normal + 0.5, 1.0);
	} else {
		gl_FragColor = vec4(vec3(0.0), 1.0);	
	}
	

}