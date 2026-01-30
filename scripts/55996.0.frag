#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float r) {
	float s = sin(r), c = cos(r);
	return mat2(s, c, -c, s);
}

float smoothMin(float d1, float d2, float k) {
	float h = exp(-k * d1) + exp(-k * d2);
	return -log(h) / k;
}

vec3 trans(vec3 p) {
	return mod(p, 4.) - 2.;
}

float sphere(vec3 p, float size) {
	 return length(p) - size;
}

float distFunc(vec3 p) {
	p.x += sin(p.y * 2.) * sin(p.y * 3.) * sin(p.y * 4.) * sin(time * 0.5) * cos(p.z);
	p.yz *= rotate(1.);
	p = trans(p);
	float size = 0.5;
	float dist = sphere(p, size);
	p.y = -abs(p.y);
	for (int i = 0; i < 3; i++) {
		size *= 0.5;
		p += vec3(0, size * 2.2, 0);
		p.xy *= rotate(sin(time) * 3.14);
		dist = smoothMin(dist, sphere(p, size), 30.);
	}
	return dist;
}

vec3 normal(vec3 p) {
	float d = 0.0001;
	return normalize(vec3(
		distFunc(p + vec3(d, 0, 0)) - distFunc(p - vec3(d, 0, 0)),
		distFunc(p + vec3(0, d, 0)) - distFunc(p - vec3(0, d, 0)),
		distFunc(p + vec3(0, 0, d)) - distFunc(p - vec3(0, 0, d))
		));
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	vec3 cameraPos = vec3(0, 0, -5) + vec3(-mouse * 10., 0);
	float screenZ = 2.5;
	vec3 rayDir = normalize(vec3(pos, screenZ));
	vec3 lightDir = normalize(vec3(1, 1, -2));
	
	vec3 col = vec3(0);
	float totalDist = 0.;
	
	for (int i = 0; i < 99; i++) {
		vec3 p = cameraPos + totalDist * rayDir;
		
		float dist = distFunc(p);
		if (dist < 0.0001) {
			col = vec3(1) * dot(normal(p), lightDir);
			break;
		}
		totalDist += dist;
	}
	
	gl_FragColor = vec4(col, 1);

}