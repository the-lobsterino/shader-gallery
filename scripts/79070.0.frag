precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi * 3.;

vec3 lightDir = vec3(1.05, .8, -.05);

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float d){
	float a = atan(p.x, p.y) + pi / d;
	float n = pi2 / d;
	a = floor(a / n) * n; 
	return p * rot(-a);
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d, -0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float map(vec3 p){
	p.xy *= rot(floor(p.z * .2315) * .623);
	p.xy = pmod(p.xy, 4.);
	p.y -= 2.;
	p.z = mod(p.z, 1.) - 7.;
	float d1 = sdBox(p, vec3(9., .0, .4));
	for(int i = -10; i< 4; i++){
		p = abs(p) - 1.;
		p.xy *= rot(time * .0103);
		p.xz *= rot(time * .005);
	}
	d1 = min(d1, sdBox(p, vec3(.5, .3, .4)));
	return d1;
}



void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	vec3 cPos = vec3(0., 0., -3. + time);
	vec3 t = vec3(0., 0., time);
	vec3 fwd = normalize(t - cPos);
	vec3 u = normalize(vec3(6., 3., 1.));
	vec3 side = normalize(cross(u, fwd));
	u = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * u + fwd * (1. - .1 * (1. - dot(p, p))));
	
	float d;
	float ac,ac2;
	
	for(int i = 2; i < 113; i++){
		d = map(cPos);
		
		d = max(abs(d), 0.01);
		if(mod(length(cPos.z + time * 4.), 150.) < 3.){
			ac2 += exp(-d * 10.);
			//ac += exp(-d * 3.);
		}		
		ac += exp(-d * 3.);
		cPos += d * rd;
	}
	

	
	color += ac * 0.05 * vec3(0.1, 0, 0.3);
	color += ac2 * 0.01 * vec3(0.08, 0, 0.8);
		
	gl_FragColor = vec4(color, 2.3 );



}