#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FAR 2000.0

const vec3 sundir = normalize(vec3(0.5, 0.6, -0.3));

float hash(vec2 p) {
	p = 50.0 * fract(p * 0.3183099);
	return fract(p.x * p.y  * (p.x + p.y));
}

float noise(vec2 x) {
	vec2 p = floor(x);
	vec2 w = fract(x);
	vec2 u = w * w * w * (w * (w * 6.0 - 15.0) + 10.0);
	
	float a = hash(p + vec2(0.0, 0.0));
	float b = hash(p + vec2(1.0, 0.0));
	float c = hash(p + vec2(0.0, 1.0));
	float d = hash(p + vec2(1.0, 1.0));
	
	return -1.0 + 2.0 * (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y);
}

mat2 m = mat2(cos(0.5), sin(0.6), -sin(0.6), cos(0.8));

float fbm5(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	for (int i = 0; i < 5; i++) {
		v += a * noise(x);
		a *= 0.5;
		x *= 2.01;
		x *= m;
	}
	return v;
}

float fbm9(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	for (int i = 0; i < 9; i++) {
		v += a * noise(x);
		a *= 0.5;
		x *= 2.01;
		x *= m;
	}
	return v;
}


float terrain5(vec2 p) {
	return fbm5(p * 0.01 + 100.0) * 100.0;
}

float terrain9(vec2 p) {
	return fbm9(p * 0.01 + 100.0) * 100.0;
}


vec3 terrainNormal(vec2 p, float t) {
	vec2 eps = vec2(0.002 * t, 0.0);
	return normalize(vec3(
		terrain9(p + eps.xy) - terrain9(p - eps.xy),
		eps.x * 2.0,
		terrain9(p + eps.yx) - terrain9(p - eps.yx)
	));
}

float intersect(vec3 ro, vec3 rd) {
	
	float t = 0.0;
	for (int i = 0; i < 150; i++) {
		vec3 p = ro  + t * rd;
		float h = terrain5(p.xz);
		float d = p.y - h;
		if (d < 0.002 * t || t > FAR) break;
		t += 0.3 * d;
	}
	
	return t;
}

float softshadow(vec3 ro, vec3 rd) {
	float res = 1.0;
	float t = 0.001;
	for (int i = 0; i < 32; i++) {
		vec3 p = ro + t * rd;
		float h = terrain5(p.xz);
		float d = p.y - h;
		res = min(res, 8.0 * d / t);
		t += d;
		if (res < 0.001|| t > FAR) break;
	}
	return clamp(res, 0.0, 1.0);
}

vec3 renderSky(vec3 ro, vec3 rd) {
	float t = (500.0 - ro.y) / rd.y;
	vec2 p = (ro + t * rd).xz;
	float v = smoothstep(0.2, 0.5, fbm5(p * 0.001 + 100.0));
	vec3 col = vec3(0.6, 0.7, 1.0);
	col = mix(col, vec3(1.0), v);
	return col;
}

vec3 render(vec3 ro, vec3 rd) {

	vec3 col = vec3(0.0);
	
	
	float t = intersect(ro, rd);

	if (t > FAR) {
		col = renderSky(ro, rd);
	} else {
		vec3 p = ro + t * rd;
		vec3 nor  = terrainNormal(p.xz, t);
		
		col = 0.15 * vec3(0.9, 0.6, 0.2);
		col = mix(col, 0.1 * vec3(0.3, 1.0, 0.1), 1.0 - clamp(0.8 * smoothstep(-100.0, 100.0, p.y) + 0.2 * fbm5(p.xz * 0.1), 0.0, 1.0));
		col = mix(col, 0.15 * vec3(0.7, 1.0, 0.2), clamp(dot(sundir, nor), 0.0, 1.0));
		
		vec3 lig = vec3(0.0);
		float amb = clamp(nor.y * 0.5 + 0.5 , 0.0, 1.0);
		float dif = clamp(dot(sundir, nor), 0.0, 1.0);
		float bac = clamp(0.2 + 0.8 * dot(normalize(vec3(-sundir.x, 0.0, -sundir.z)), nor) , 0.0, 1.0);
		float sh = softshadow(p + sundir * 0.01, sundir);
		
		lig += amb * vec3(0.5, 0.7, 1.0) * 1.5;
		lig += dif * vec3(1.0, 0.9, 0.6) * 3.0 * sh;
		lig += bac * vec3(1.0, 0.7, 0.5) * 0.5;
		
		col *= lig;
		
		col = mix(col, vec3(0.6, 0.7, 1.0), 1.0 - exp(-0.0000005 * t * t));		

	}
	
	
	col = sqrt(col);
	
	
	return col;
}

vec3 cameraPath(float t) {
	return vec3(100.0 * cos(t * 0.005), 200.0 + 30.0 * cos(t * 0.01), t);
}

mat3 camera(vec3 ro, vec3 ta, vec3 up) {
	vec3 nz = normalize(ta - ro);
	vec3 nx = cross(nz, normalize(up));
	vec3 ny = cross(nx, nz);
	return mat3(nx, ny, nz);
}


void main( void ) {

	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	float time = time * 100.0;
	
	vec3 ro = cameraPath(time);
	vec3 ta = cameraPath(time + 20.0);
	vec3 rd = camera(ro, ta, vec3(0.0, 1.0, 0.0)) * normalize(vec3(st, 1.0));

	vec3 col = render(ro, rd);
	
	gl_FragColor = vec4(col, 5.0);
}