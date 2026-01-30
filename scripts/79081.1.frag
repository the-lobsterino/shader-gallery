#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d, -0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

void U(inout vec2 m, vec2 d) {
    if (d.x < m.x) m = d;
}

vec2 map(vec3 p){
	vec3 q = p;
	float t = floor(time) + smoothstep(.7, 1., fract(time));
	p.z = mod(p.z, 6.) - 3.;
	p.x = mod(p.x, 3.) - 1.5;
	p.xy *= rot(sign(p.x) * p.z 
		   * .1);
	for(int i = 0; i < 5; i++){
		p = abs(p) - .5;
		p.xy *= rot(.54);
		p = abs(p) - .39;
		p.zy *= rot(-.095);
	}
	vec2 d = vec2(sdBox(p, vec3(.23, .26, .31)), 0.);
	
	q.z = mod(q.z, 3.) - 1.5;
	float s = 1.;
	for(int i = 0; i < 3; i++){
		q = abs(q) - .4;
		q.xy *= rot(.6);
		q = abs(q) - .1;
		s *= 1.4;
		q *= 1.4;
	}
	
	vec2 d2 = vec2(sdSphere(q, .5) / s, 1.);
	
	U(d, d2);
	
	return d;
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0.001, 0.);
	return normalize(vec3(
		map(p + d.xyy).x - map(p - d.xyy).x,
		map(p + d.yxy).x - map(p - d.yxy).x,
		map(p + d.yyx).x - map(p - d.yyx).x
		));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 col = vec3(0.0);
	//col.xy = p;
	
	vec3 cp = vec3(0., 0., -9. + time);
	vec3 t = vec3(0., 0., 0. + time);
	vec3 f = normalize(t - cp);
	vec3 u = vec3(0., 1., 0.);
	vec3 s = normalize(cross(u, f));
	u = normalize(cross(f, s));
	vec3 rd = normalize(p.x * s + p.y * u + f);
	
	float d;
	vec2 dd;
	int k;
	
	for(int i = 0; i < 100; i++){
		dd = map(cp + d * rd);
		if(dd.x < 0.001){
			if(dd.y == 0.){
				vec3 normal = genNormal(cp + d * rd);
				float edge = clamp(pow(length(normal - genNormal(cp + d * rd - 0.001)) * 55., 55.), 0., 1.);
				col += edge;
				//col += 1. -  float(k) / 100.;
				break;
			}
			if(dd.y == 1.){
				col += 0.01 * exp(-dd.x * 3.) * vec3(.3, .6, .9) * .6 + vec3(.5, .8, .9) * .02  * step(mod((cp + d * rd).z + time * 3., 5.), 1.);
				dd.x = max(abs(dd.x), 0.001);
			}
		}
		k = i;
		d += dd.x;
	}
	
	vec3 ip = cp + d * rd;
	
	
	col = pow(col, vec3(0.4545));
	
	gl_FragColor = vec4(col, 1.0 );

}