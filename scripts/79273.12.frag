#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

float bpm;
float PI = acos(-1.);

float rand(vec2 p){
	return fract(sin(dot(p, vec2(23.421, 92.532))) * 4132.5324);
}

vec3 hsv(float h, float s, float v){
return ((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

vec2 pmod(vec2 p, float d){
	float a = atan(p.x, p.y) + PI / d;
	float n = 2. * PI / d;
	a = floor(a / n) * n;
	return p * rot(-a);
}

float sdBox(vec3 p, vec3 b){
	p = abs(p) - b;
	return length(max(p, 0.)) + min(max(max(p.x, p.y), p.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

vec2 U(vec2 d1, vec2 d2){
	return (d1.x < d2.x) ? d1 : d2;
}

vec2 map(vec3 p){
	vec3 q = p;
	float div = 8.;
	q.z = mod(q.z - div / 2., div) - div / 2.;
	for(int i = 0; i < 8; i++){
		q.yx *= rot(1.);
		q = abs(q) - 1.5 + .25 * (1. + .3 * smoothstep(.2, 1., sin( (bpm + floor((p.z - div / 2.) / div) * .09)* PI * 2.) ));
		q.yz *= rot(.5 );
	}
	float d1 =  sdBox(q, vec3(.15, 1.9, .8));
	
	q = p;
	q.z -= time * 12.;
	
	q.xy *= rot(time);
	q.zy *= rot(time);
	
	float d2 = sdSphere(q, 1.);
	
	
	for(int i = 0; i < 5; i++){
		q = abs(q) - 1.;
		q.xz *= rot(.2 * time);
		d2 = max(d2, -sdBox(q, vec3(.5, .6, .9)));
		q.xy *= rot(time);
	}
	
	
	return U(vec2(d2, 1.), vec2(d1, 0.));
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

	bpm = time * 127. / 60.;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = (p - .5) * 2.;
	p.y *= resolution.y / resolution.x;

	vec3 col = vec3(0.0);
	//col.xy = p;

	float speed = time * 12.0;
	
	vec3 cp1 = vec3(5., 5., - 8. + speed);
	vec3 cp2 = vec3(sin(time) * 1.2, cos(time * 1.1 + 2.5), -8. + speed);
	vec3 cp = mix(cp1, cp2, step(0.,sin(time * .4))); 
	vec3 t = vec3(0., cos(time ) * .5, 0. + speed);
	vec3 f = normalize(t - cp);
	vec3 u = vec3(0., 1., 0.);
	vec3 s = normalize(cross(u, f));
	u = normalize(cross(f, s));
	vec3 rd = normalize(p.x * s + p.y * u + f );
	
	float d;
	vec2 dd;
	int k;
	cp += rd * 2.2;
	
	for(int i = 0; i < 100; i++){
		dd = map(cp + d * rd);
		if(dd.x < 0.001){
			//col += 1.;
			break;
		}
		k = i;
		d += dd.x;
	}
	
	if(dd.y == 0.){
		float ao = 1. - float(k) / 100.;
	
		col += vec3(1.2 - ao, .8 - ao * 1.6, .7);
	}
	if(dd.y == 1.){
		vec3 normal = genNormal(cp + d * rd);
		float rim = pow(1. - abs(dot(normal, rd)), 2.);
		col += rim * vec3(.2, .4, 1.2);
		col += float(k) / 100.;
	}
	
	
	gl_FragColor = vec4(col, 1.0 );

}