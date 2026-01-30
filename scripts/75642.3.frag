#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
	vec3 o;
	vec3 d;
};

struct Inter {
	float t;
	vec3 n;
};

Ray GetCameraRay(vec2 pixm11, vec3 camPos, vec3 camTarget) {
	vec3 f = normalize(camTarget - camPos);
	vec3 r = cross(f, vec3(0, 0, 1));
	vec3 u = cross(f, r);
	return Ray(camPos, normalize(f + r * pixm11.x + u * pixm11.y));
}

Inter AABB(Ray r, vec3 pos, vec3 dims) {
	vec3 hDims = 0.5 * dims;
	vec3 lower = pos - hDims;
	vec3 upper = pos + hDims;
	vec3 oord = 1.0 / r.d;
	vec3 a = (lower - r.o) * oord;
	vec3 b = (upper - r.o) * oord;
	vec3 mi = min(a, b);
	vec3 ma = max(a, b);
	float tmax = min(min(ma.x, ma.y), ma.z);
	float tmin = max(max(mi.x, mi.y), mi.z);
	if (tmin > tmax) return Inter(1e9, vec3(0));
	vec3 d = normalize((r.o + tmin * r.d) - pos);
	vec3 q = vec3(abs(d.x), abs(d.y), abs(d.z));
	vec3 n;
	if (q.x > q.y)
		n = q.x > q.z ? vec3(sign(d.x), 0.0, 0) : vec3(0, 0, sign(d.z));
	else
		n = q.y > q.z ? vec3(0.0, sign(d.y), 0) : vec3(0, 0, sign(d.z));
	return Inter(tmin, -n);
}
	
vec3 sampleSky(vec3 dir) {
	return (1.0 - abs(dot(dir, vec3(0.0, 0, 1)))) * vec3(0.5, 0.8, 0.8);
}

void main( void ) {
	vec3 camPos = vec3(2, 2, 1);
	//vec3 camPos = vec3(cos(time), -sin(time), 1) * 2.0;
	vec3 camTarget = vec3(0, 0, 0);
	float camFov = 1.0;
	vec3 lightPos = vec3(cos(time), -sin(time), 1) * 5.0;
	vec3 lightCol = vec3(0.9, 0.9, 0.9);
	float energy = 1.5;
	
	vec2 pix01 = gl_FragCoord.xy / resolution.xy;
	vec2 pixm11 = pix01 * 2.0 - 1.0;
	pixm11.x *= resolution.x / resolution.y;
	pixm11.y = -pixm11.y;
	pixm11 *= camFov;
	
	Ray r = GetCameraRay(pixm11, camPos, camTarget);
	Inter i = AABB(r, vec3(0, 0, 0), vec3(1, 1, 1));
	
	vec3 col = vec3(0);
	
	if (i.t < 1e9) {
		vec3 p = r.o + i.t * r.d;
		vec3 l = p - lightPos;
		float ln = length(l);
		l /= ln;
		col = max(sampleSky(i.n) * 0.3, dot(l, i.n)) * lightCol * energy * vec3(1, 0, 0);
	} else {
		col = sampleSky(r.d);
	}
	
	gl_FragColor = vec4(col, 1);
}