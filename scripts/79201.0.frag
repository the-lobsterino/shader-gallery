#extension GL_OES_standard_derivatives : enable

#define saturate(a) clamp(a, 0., 1.);

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.);

const vec3 lightDir = normalize(vec3(-.5, .5, -.5));

float bpm;

vec2 U(vec2 d1, vec2 d2){
	return (d1.x < d2.x) ? d1 : d2;
}

mat2 rot(float a){
	float s = (a), c = cos(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float d){
	float a = atan(p.x, p.y) + PI / d;
	float n = 2. * PI / d;
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

vec2 map(vec3 p){
	vec3 q = p;
	q.xz *= rot(time);
	
	float beat = floor(bpm) + smoothstep(.7, 1.,fract(bpm));
	
	vec2 d2 = vec2(sdBox(q, vec3(.2)), 1.);
	q.xz = pmod(q.xz, 3.);
	for(int i = 0; i < 3; i++){
		q = abs(q) - .42;
		q.xy *= rot(-.61);
		q.y -= 1.1;
		q.xy *= rot(-.9);
		q.xz *= rot(1. * beat);
	}
	vec2 d1 = vec2(sdBox(q, vec3(.4, .8, .2)), 0.);
	q.xy *= rot(.31);
	d2 = U(d2,vec2(sdBox(q, vec3(.2, .8, .21)), 1.));
	
	q = p;
	q.xz *= rot(-time);
	q.xz = pmod(q.xz, 18.);
	q.z -= 4.5;
	
	for(int i = 0; i < 2; i++){
		q = abs(q) - .1;
		q.xy *= rot(-.31);
		q.xz *= rot(1.81);
	}
	
	vec2 d3 = vec2(sdBox(q, vec3(.01, .3, .01)), 1.);
	
	return U(U(d1, d2), d3);
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
	
	bpm = 137.8 / 60. * time;

	vec2 p = ( gl_FragCoord.xy *  2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 col = vec3(0.0);

	vec3 cp = vec3(0., 2., -7.);
	vec3 t = vec3(0., 0., 0.);
	vec3 f = normalize(t - cp);
	vec3 u = vec3(sin(time * .2), 1., 0.);
	vec3 s = normalize(cross(u, f));
	u = normalize(cross(f, s));
	vec3 rd = normalize(p.x * s + p.y * u + f);
	
	float d;
	vec2 dd;
	int k;
	
	const float maxDist = 30.;
	
	for(int i = 0; i < 100; i++){
		dd = map(cp + d * rd);
		if(dd.y == 0.){
			if(dd.x < 0.001){
				//col += 1.;
				break;
			}
			d += dd.x;
		}
		else{
			//col += exp(-dd.x * 3.) * .01 * vec3(.7, .3, .3);
			col += saturate(.0001 / abs(dd.x) * vec3(1.2, .1, .1));
			//col *= ;
			d += max(abs(dd.x), .009);
		}
		if(d > maxDist) break;
		k = i;
	}
	
	vec3 ip = cp + d * rd;
	
	if(dd.x < 0.001 && dd.y == 0.){
		vec3 normal = genNormal(ip);
		
		float diff = saturate(dot(normal, lightDir));
		float spec = saturate(dot(reflect(normal, rd), lightDir));
		spec = pow(spec, 3.);
		
		col += spec * vec3(.2, .6, 1.2);
		col += diff * .1;
		
		//col += 1. - float(k) / 100.;			
		
	}
	
	
	gl_FragColor = vec4( col, 1.0 );

}