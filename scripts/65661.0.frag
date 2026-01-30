#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3 trans(vec3 p, float w) {
	return mod(p, w) - w * .5;
}

vec3 rotate(vec3 p, float angle, vec3 axis) {
	vec3 a = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float r = 1. - c;
	mat3 m = mat3(
		a.x * a.x * r + c,
		a.y * a.x * r + a.z * s,
		a.z * a.x + r + a.y * s,
		a.x * a.y * r + a.z * s,
		a.y * a.y * r + c,
		a.z * a.y * r + a.x * s,
		a.x * a.z * r + a.y * s,
		a.y * a.z * r + a.x * s,
		a.z * a.z * r + c
	);
	return m * p;
}

vec3 twist(vec3 p, float power) {
	float s = sin(power * p.y);
	float c = cos(power * p.y);
	mat3 m = mat3(
		 c, 0., -s,
		0., 1., 0.,
		 s, 0.,  c
	);
	return m * p;
}

float distFuncBox(vec3 p, vec3 s, float r) {
	vec3 q = abs(p);
	return length(max(q - s + r, 0.)) - r;
}

float distFunc(vec3 p) {
	vec3 tp = trans(p, 1.3);
	tp = rotate(tp, cos(time + length(p)) * .3, p);
	tp = twist(tp, sin(time + length(p)) * 3.14 * 6.);

	float dxy = distFuncBox(tp, vec3(.5, .1, .02), .02);
	float dyz = distFuncBox(tp, vec3(.02, .5, .1), .02);
	float dxz = distFuncBox(tp, vec3(.1, .02, .5), .02);

	float d = min(dxy, dyz);
	d = min(d, dxz);

	return dyz;
}

vec3 getNormal(vec3 p) {
	vec3 d = vec3(.001, 0., 0.);
	return normalize(vec3(
		distFunc(p + d.xyy) - distFunc(p - d.xyy),
		distFunc(p + d.yxy) - distFunc(p - d.yxy),
		distFunc(p + d.yyx) - distFunc(p - d.yyx)
	));
}

void main(void) {
	float mn = min(resolution.x, resolution.y);
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / mn;

	float t = time * .02;
	vec3 cPos = vec3(cos(t), -sin(t), sin(t)) * 3.;
	vec3 cDir = normalize(-cPos);
	vec3 cUp = vec3(0., 1., 0.);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = (sin(time * .4) * .5 + .5) * 4. + 1.;
	vec3 ray = normalize(vec3(cSide * pos.x + cUp * pos.y + cDir * targetDepth));

	float dist = 0.;
	float rLen = 0.;
	vec3 rPos = cPos;
	bool hit = false;
	for (int i = 0; i < 80; ++i) {
		dist = distFunc(rPos);
		hit = abs(dist) < .001;
		if(hit) break;
		rLen += dist;
		rPos = cPos + ray * rLen * .75;
	}
	
	vec3 c = vec3(.7, .7, .2);
	vec3 color = c * .3;
	if(hit) {
		vec3 n = getNormal(rPos);
		float t = time * 2.;
		vec3 lPos = vec3(cos(t), cos(t * .3), sin(t)) * 9.;
		vec3 lDir = normalize(lPos - rPos);
		float diff = clamp(dot(lDir, n), .6, 1.);
		color = vec3(diff);
		color *= c;
		color = floor(color * 10.) / 10.;
		// color = vec3(n);
	}

	gl_FragColor = vec4(color, 1.);
}