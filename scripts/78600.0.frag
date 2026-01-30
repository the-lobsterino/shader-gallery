#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi * 2.;

vec3 lightDir = vec3(0.5, .5, -.5);

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
	p.xy *= rot(floor(p.z * 5.) * 1.5);
	p.xy = pmod(p.xy, 4.);
	p.y -= 2.;
	p.z = mod(p.z, 8.) - 4.;
	float d1 = sdBox(p, vec3(1., .3, .4));
	for(int i = 0; i< 4; i++){
		p = abs(p) - 1.;
		p.xy *= rot(time * .3);
		p.xz *= rot(time * .45);
	}
	d1 = min(d1, sdBox(p, vec3(1., .3, .4)));
	return d1;
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0.001, 0.);
	return normalize(vec3(
		map(p + d.xyy) - map(p - d.xyy),
		map(p + d.yxy) - map(p - d.yxy),
		map(p + d.yyx) - map(p - d.yyx)
		));
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
		if(d < 0.001){
			//color += 1.;
			//break;
		}
		d = max(abs(d), 0.01);
		if(mod(length(cPos.z + time * 24.), 30.) < 3.){
			ac2 += exp(-d * 3.);
			//ac += exp(-d * 3.);
		}		
		ac += exp(-d * 3.);
		cPos += d * rd;
	}
	
	vec3 normal = genNormal(cPos);
	
	float diff = clamp(dot(lightDir, normal), 0.1, 1.);
	
	color += ac * 0.01 * vec3(0.3, 0, 0.8);
	color += ac2 * 0.01 * vec3(0.3, 0, 2);
		
	gl_FragColor = vec4(color, 1.0 );

}