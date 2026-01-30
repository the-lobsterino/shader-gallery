#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash2(vec2 p) {
	return fract( sin( dot(vec2(15.0, 35.7), p) ) * 43648.32 );
}

float hash3(vec3 p) {
	return fract( sin( dot(vec3(15.0, 35.7, 75.2), p) ) * 43648.32 );
}

float noise(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	f = 3.0 * f*f - 2.0 * f*f*f;
	
	float lb = hash2(g + vec2(0.0, 0.0));
	float rb = hash2(g + vec2(1.0, 0.0));
	float lt = hash2(g + vec2(0.0, 1.0));
	float rt = hash2(g + vec2(1.0, 1.0));

	// linear interpolation
	float b = mix(lb, rb, f.x);
	float t = mix(lt, rt, f.x);
	float res = mix(b, t, f.y);
	
	return res;
}

float noise3(vec3 p) {
	vec3 g = floor(p);
	vec3 f = fract(p);
	f = 3.0 * f*f - 2.0 * f*f*f;
	
	float lbd = hash3(g + vec3(0.0, 0.0, 0.0));
	float rbd = hash3(g + vec3(1.0, 0.0, 0.0));
	float ltd = hash3(g + vec3(0.0, 1.0, 0.0));
	float rtd = hash3(g + vec3(1.0, 1.0, 0.0));
	
	float lbu = hash3(g + vec3(0.0, 0.0, 1.0));
	float rbu = hash3(g + vec3(1.0, 0.0, 1.0));
	float ltu = hash3(g + vec3(0.0, 1.0, 1.0));
	float rtu = hash3(g + vec3(1.0, 1.0, 1.0));
	
	// linear interpolation
	float bd = mix(lbd, rbd, f.x);
	float td = mix(ltd, rtd, f.x);
	float d = mix(bd, td, f.y);
	
	float bu = mix(lbu, rbu, f.x);
	float tu = mix(ltu, rbu, f.x);
	float u = mix(bu, tu, f.y);
	
	float res = mix(d, u, f.z);
	
	return res;
}

float sdPlane(vec3 p) {
	return p.y + noise(p.xz * 1.0) * 0.5;
}

float sdSphere(vec3 p) {
	return length(p) - 0.5 + noise3(p * 10.0 + time) * 0.1;
}

float map(vec3 p) {
	float d = sdPlane(p - vec3(0.0, 0.0, time));
	d = min(d, sdSphere(p - vec3(sin(time), 0.25, 0.0)));
	return d;
}

vec3 calcNormal(vec3 p) {
	vec2 e = vec2(0.0001, 0.0);
	vec3 nor = vec3(
		map(p + e.xyy) - map(p - e.xyy),
		map(p + e.yxy) - map(p - e.yxy),
		map(p + e.yyx) - map(p - e.yyx)
	);
	return normalize(nor);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	float aspect = resolution.x / resolution.y;
	p.x *= aspect;
	float fovy = 3.141592 / 4.0;
	float d = 1.0 / tan(fovy * 0.5);
	
	vec3 ro = vec3(0.0, 2.0, 3.0);
	vec3 center = vec3(0.0, 0.0, 0.0);
	vec3 cw = normalize(center - ro);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize(cross(cw, up));
	vec3 cv = normalize(cross(cu, cw));
	
	vec3 rd = normalize(p.x * cu + p.y * cv + d * cw);
	
	float e = 0.0001;
	float t = 0.0;
	float h = e * 2.0;
	for(int i = 0; i < 60; i++) {
		if(h < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h;
	}

	float col = 0.0;
	if(t < 20.0) {
		vec3 pos = ro + rd * t;
		vec3 lig = normalize(vec3(1.0));
		vec3 nor = calcNormal(pos);
		float dif = clamp(dot(nor, lig), 0.0, 1.0);
		
		col = dif;
	}
	

	gl_FragColor = vec4( vec3( col ), 1.0 );

}