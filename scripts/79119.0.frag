precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi * 2.0;

vec3 lightDir = vec3(0.15, .5, -.05);

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
	return length(max(d, 0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float map(vec3 p){
	p.xy *= rot(floor(p.z * .0005) * .005);
	p.xy = pmod(p.xy, 4.);
	p.y -= 2.;
	p.z = mod(p.z, 8.) - 4.;
	float d1 = sdBox(p, vec3(1., .3, .4));
	for(int i = 0; i< 4; i++){
		p = abs(p) - 1.;
		p.xy *= rot(time * .03);
		p.xz *= rot(time * .0035);
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
	vec3 u = normalize(vec3(0., 1., 0.));
	vec3 side = normalize(cross(u, fwd));
	u = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * u + fwd * (1. - .1 * (1. - dot(p, p))));
	
	float d;
	float ac,ac2;
	
	for(int i = 0; i < 100; i++){
		d = map(cPos);
		
		d = max(abs(d), 0.001);
		if(mod(length(cPos.z + time * 4.), 150.) < 3.){
			ac2 += exp(-d * 3.);
			//ac += exp(-d * 3.);
		}		
		ac += exp(-d * 3.);
		cPos += d * rd;
	}
	
	float base = (ac * 0.05 + ac2 * 0.01) * 0.35 * (1.0 - length(p) * 0.2);
	color.r = pow(base * 0.8, 1.7);
	color.g = pow(base * 0.6, 2.2);
	color.b = pow(base * 1.3, 0.7);
		
	gl_FragColor = vec4(color, 1.0 );

}