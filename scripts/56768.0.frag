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

vec3 trans(vec3 p) {
	return mod(p, 4.) - 2.;
}

float distFunc(vec3 p) {
	p.x += sin(p.z / 5.);
	p.y += cos(p.z / 5.);
	p.z += mod(time, 10.) * 20.;
	p.xy *= rotate(time / 3.);
	
	p = trans(p);
	
	p.xz += sin(p.y * 50.) / 10. * sin(time);
	
	return length(p) - (0.5 + (sin(time * 0.5) + 1.) / 5.);
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
	vec3 cameraPos = vec3(0, 0, -5);
	float screenZ = 2.5;
	vec3 rayDir = normalize(vec3(pos, screenZ));
	vec3 lightDir = normalize(vec3(1, 1, -2));

	vec3 col = vec3(0);
	float totalDist = 0.;
	for (int i = 0; i < 128; i++) {
		vec3 p = cameraPos + rayDir * totalDist;
		float dist = distFunc(p);
		if (dist < 0.0001) {
			col = vec3(1) * dot(lightDir, normal(p));
			break;
		}
		totalDist += dist;
	}
	
	gl_FragColor = vec4(col, 1);
}