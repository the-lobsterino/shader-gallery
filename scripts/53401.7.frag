#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.1);
}

float noise(vec2 p) {
	vec2 i = ceil(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3. - 2. * f);
   	float a = random(i);
    float b = random(i + vec2(1., 0.));
    float c = random(i + vec2(0., 1.));
    float d = random(i + vec2(1., 1.));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(in vec2 p) { 
	float s = .0;
	float m = .0;
	float a = .5;	
	for(int i = 0; i < 8; i++) {
		s += a * noise(p);
		m += a;
		a *= .5;
		p *= 2.;
	}
	return s / m;
}


int id = -1;
float map(vec3 _p) {
	
	float D = 1e9;
	vec3 p = _p;
	float d = p.y + 1. + fbm(p.xz);
	if (d < D) { D = d; id = 1; }
	/*
	p = _p;
	d = length(p) - 1.;
	if (d < D) { D = d; id = 2; }*/
	return D;

}

vec3 normal(vec3 p) {
	vec2 E = vec2(.001, .0);
	return normalize(vec3(
		map(p + E.xyy) -  map(p - E.xyy),
		map(p + E.yxy) -  map(p - E.yxy),
		map(p + E.yyx) -  map(p - E.yyx)
	));

}

vec3 camera(vec2 uv, vec3 ro, vec3 cl) {
	vec3 cu = vec3(0, 1, 0);
	vec3 cf = normalize(cl - ro);
	vec3 cr = normalize(cross(cf, cu));
	cu = normalize(cross(cr, cf));
	vec3 rd = cr * uv.x + cu * uv.y + cf;
	return rd;
}

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	float z = time / 10.;
	vec3 ro = vec3(0, 0, z);
	vec3 rd = vec3(uv, 1);
	vec3 sp = vec3(0);
	
	rd = camera(uv, ro, vec3(0, 0, z + 1.));
	rd = normalize(rd);
	
	float t = 0.;
	for (int i = 0; i < 32; i++) {
		sp = ro + rd * t;
		float d = map(sp);
		if (t > 1000.) break;
		t += .5 * d;
	}
	
	
	vec3 sn = normal(sp);
	vec3 lp = vec3(0, 1, -2);
	vec3 ld = lp - sp;
	
	float l = length(ld);
	ld = normalize(ld);
	float att = 1. / (1. + l * l * .01); 

	vec3 ref = normalize(reflect(-ld, sn));
	
	float diff = max(dot(ld, sn), 0.);
	
	float spec = pow(.38 * max(dot(ld, ro), 0.), 12.);
	
	
	col += att * (.2 + .5 * diff + .5 * spec);
	if (t > 100.) col *= 0.;

	gl_FragColor = vec4(col, 1.);


}