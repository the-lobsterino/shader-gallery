#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 foldX(vec3 p) {
	p.xz = abs(p.xz);
	return p;
}

vec3 trans(vec3 p) {
	return mod(p, 10.) - 5.;	
}

mat2 rotate(float a) {
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

float box(vec3 p, vec3 s) {
	return length(max(abs(p) - s, 0.));
}

float distFunc(vec3 p) {
	if(abs(p.y+3.) <= 6.)
	p = trans(p);
	float scale = 0.8;
	vec3 size = vec3(0.1, 1, 0.1);
	float d = box(p, size);
	for (int i = 0; i < 12; i++) {
		vec3 q = foldX(p);
		q.y -= size.y;
		q.xy *= rotate(-0.2 - abs(sin(float(i))) * 1.);
		q.zy *= rotate(-0.2 - abs(sin(float(i))) * 1.);
		d = min(d, box(p, size));
		if (d < 0.0001) return d;
		p = q;
		size.xy *= scale;
	}
	
	return d;
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
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	vec3 cameraPos = vec3(0, 0, -5);
	float screenZ = 2.5;
	vec3 rayDir = normalize(vec3(p, screenZ));
	vec3 lightDir = normalize(vec3(1, 1, -2));
	
	vec3 col = vec3(0);
	float totalDist = 0.;
	
	for (int i = 0; i < 30; i++) {
		vec3 pos = cameraPos + totalDist * rayDir;
		float dist = distFunc(pos);
		if (dist < 0.0001) {
			col = vec3(1) * dot(normal(pos), lightDir);
			continue;
		}
		totalDist += dist;
	}
	
	gl_FragColor = vec4(mix(vec3(.4,1,.3), vec3(.1,.5,1), 1.-col.x), 1);
}