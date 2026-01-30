#ifdef GL_ES
precision mediump float;
#endif

// a bit more readable version --novalis

uniform vec2 resolution;
uniform float time;
const float pi = 3.14159;

float r = .125-.25*cos(pi*time/8.);
float b = .125+.25*sin(pi*time/8.);
float g = time/32.;

vec2 n(vec2 m,float v){
	return vec2(cos(v)*m.x-sin(v)*m.y, sin(v)*m.x+cos(v)*m.y);
}

float scene(vec3 v){
	float r=.25;
	float b=r;
	float m=length(mod(v.rgb,r)-r*.5)-b;
	float g=r*.55;
	float s=length(mod(v.rgb,r)-r*.5)-g;
	float n=.055;
	float f=n*.4;
	float t=length(max(abs(mod(v.gb,n)-n*.5)-f,0.));
	float d=length(max(abs(mod(v.rb,n)-n*.5)-f,0.));
	float x=length(max(abs(mod(v.rg,n)-n*.5)-f,0.));
	return max(max(m,-s),max(d,max(d,x)));
}

vec3 normal(vec3 v){
	vec2 eps = vec2(1e-3,0);
	return normalize(
		vec3(scene(v+eps.xyy)-scene(v-eps.xyy),
		     scene(v+eps.yxy)-scene(v-eps.yxy),
		     scene(v+eps.yyx)-scene(v-eps.yyx))
	);
}

float raymarch(vec3 v,vec3 r,float g){
	for (int f=0; f<96; f++) {
		float b = scene(v + r*g);
		g += b;
	}
	return g;
}

void main(){
	vec2 pos = gl_FragCoord.xy/resolution.xy;
	pos = -1. + 2.*pos;
	
	vec3 rd = normalize(vec3(pos*vec2(resolution.x/resolution.y,1.), .85));
	rd.yz = n(rd.yz, pi*sin(time*.125));
	rd.zx = n(rd.zx, pi*cos(time*.125));
	rd.xy = n(rd.xy, -time*.25);
	
	vec3 t = vec3(r,b,g);
	
	float x = 0.;
	x = raymarch(t, rd, x);
	
	vec3 l = t + rd*x;
	x += l;
	vec3 n = normal(l);
	if (dot(rd, n) < -.05) rd = normalize(refract(rd, n, .77));
	rd = normalize(refract(rd, n, 1./.82));
	if (dot(rd, n) < -.15) rd = normalize(refract(rd, n, .6));
	if (dot(rd, n) > 20.) rd = refract(rd, n, .28);
	if (dot(rd, n) > 5.) rd = reflect(rd, n);
	x = raymarch(t, rd, x);
	float e = (n.x + n.y + n.z)/2.;
	float color = e*x*.125*pos.x + x*.1;
	gl_FragColor=vec4(0, pow(color*5., 1.2), 0, 1.);
}
