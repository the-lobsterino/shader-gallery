#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 trans(vec3 p) {
	return mod(p, 10.) - 5.;
}

float sphere(vec3 p) {
	return length(p) - (0.5 + 0.1 * sin(time * 12.));
}

float box(vec3 p) {
	p = trans(p);
	p *= mat3(
		1,0,cos(time),
		sin(time),1,0,
		-0.5,0.1,-sin(time)
		);
	p = abs(p) - vec3(0.1, 0.2, 3. + abs(sin(time)) * 10.);
	return length(max(p + 0.1, 0.)) - 0.1;
}

float plain(vec3 p) {
	return max(p.y, p.z);
}

float distFunc(vec3 p) {
	return min(box(p),  sphere(p));
}

vec3 normal(vec3 p) {
	float d = 0.0001;
	return normalize(vec3(
		distFunc(p - vec3(d, 0, 0)) - distFunc(p - vec3(-d, 0, 0)),
		distFunc(p - vec3(0, d, 0)) - distFunc(p - vec3(0, -d, 0)),
		distFunc(p - vec3(0, 0, d)) - distFunc(p - vec3(0, 0, -d))
		));
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.  - resolution.xy) / min(resolution.x, resolution.y);
	vec3 cameraPos = vec3(0, 0, -5);
	float screenZ = 2.5;
	vec3 rayDir = normalize(vec3(p, screenZ));
	vec3 lightPos = cameraPos + vec3(0, 0, 0);
	vec3 lightCol = vec3(0.4, 0.8, 1);
	
	vec3 col = vec3(0);
	float totalDist = 0.;
	
	for (int i = 0; i < 256; i++) {
		vec3 pos = cameraPos + rayDir * totalDist;
		float dist = distFunc(pos);
		if (dist < 0.0001) {
			col = vec3(1.) * lightCol * dot(normal(pos), normalize(pos - lightPos) * 50. / length(pos - lightPos));
			break;
		}
		totalDist += dist;
	}
	gl_FragColor = vec4(col * mat3(
		max(sin(time * 3.5), 0.1), 0, 0,
		0, max(-sin(time * 2.3), 0.1), 0,
		0, 0, max(cos(time * 1.2), 0.1)
	), 1);
}