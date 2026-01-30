precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi * 2.;

float sdBox(vec3 p, vec3 b){
	vec3 q = abs(p) - b;
	return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float sdShpere(vec3 p, float r){
	return length(p) - r;
}

mat2 rot(float a){
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float r){
	float a = atan(p.x, p.y) + pi / r;
	float n = pi2 / r;
	a = floor(a / n) * n;
	return p * rot(-a);
}

float map(vec3 p){
	vec3 q = p;
	q.xy *= rot(tan(time*.5));
	q.xy = pmod(q.xy, 6.);

	float d = 1e5;
	float s = 1.;
	float sum = s;
	float bs = .5;

	//d = sdShpere(p, abs(sin(time)));

	for(int i=0; i<4; i++){

		q.xy *= rot(time * float(i));
		//float td = sdBox(q, vec3(bs)) / sum;
		float tl = sdBox(q, vec3(30., 0.1*(5.-float(i)), 0.1*(5.-float(i))));
		q = abs(q) - vec3(5.);

		//d = min(d, td);
		d = min(d, tl);

		q *= s;
		sum *= s;

		if(i == 0) {
			vec3 q2 = q;
			q2.xy = pmod(q2.xy, 12.);
			q2.yz *= rot(time);
			d = min(d, sdBox(q2, vec3(1.)));
		}

	}

	return d;
}

/**
エッジあり法線
*/
vec3 e_normal(vec3 p){
	float d = .05;
	vec2 k = vec2(1., -1.);
	return normalize(
		k.xyy * map(p + k.xyy * d) +
		k.yxy * map(p + k.yxy * d) +
		k.yyx * map(p + k.yyx * d)
		);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	vec3 ro = vec3(0., 0., 3.);
	float gTime = pow(abs(sin((time-1.)*.5))+.5, 8.);
	ro.z += gTime;
	vec3 ta = vec3(0.);
	vec3 cDir = normalize(ta - ro);
	vec3 up = vec3(0., 1., 0.);
	vec3 side = cross(cDir, up);
	float fov = 1.;

	vec3 ray = normalize(side*p.x + up*p.y + cDir*fov);
	vec3 col = vec3(2.5 - length(p)) *  1./gTime;
	col = vec3(0.);
	//col = vec3(clamp(col.x, 0., 1.));
	vec3 rayPos = ro;
	float d, t = 0.;

	for(int i=0; i<32; i++){
		rayPos = ro + ray * d;
		t = map(rayPos);
		if(t < .01){
			vec3 n = e_normal(rayPos);
			float edge = clamp(pow(length(n - e_normal(rayPos - .001)) * 30., 3.), 0., 1.);
			col = vec3(edge);
			col.x *= 2.5;
		}
		d += t;
	}

	gl_FragColor = vec4(col, 1.);

}