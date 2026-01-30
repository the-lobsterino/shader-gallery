#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.14159265;

mat2 genRot(float v){
	return mat2(cos(v),-sin(v),sin(v),cos(v));
}

float stime(){
	float a = floor(time);
	float b = smoothstep(0.,1.,fract(time));
	return a + b;
}

float map(vec3 p){
	//p = (fract(p / 2. + 0.5) - 0.5) * 2.;
	p.xz *= genRot(stime() * PI/1.5);
	p.xy *= genRot(stime() * PI/1.5);
	p = (fract(p / 2. + 0.5) - 0.5) * 2.;
	vec3 q = abs(p);
	float c = max(q.x,max(q.y,q.z)) - 0.5;
	for(int i = 0; i < 10; i ++){
		q.xz *= genRot(stime() * PI / 6.);
		p.yz *= genRot(stime() * PI / 3.);
		p.xy *= genRot(stime() * PI /4.);
		q *= 3.0;
		float pole = abs(q.x) - 0.5;
		pole = min(pole,abs(q.y) - 0.5);
		pole = min(pole,abs(q.z) - 0.5);
		c = max(c, -pole);
		q -= 1.;
		q = abs(q);
	}
	return c;
}
vec3 getNormal(vec3 p){
	vec3 x = dFdx(p);
	vec3 y = dFdy(p);
	return normalize(cross(x,y));
}
vec4 trace(vec3 o,vec3 r){
	vec4 d;
	float t = 0.;
	for(int i = 0; i < 256; i++){
		vec3 p = o + r * t;
		float d = map(p);
		t += d * 0.1;
	}
	vec3 p = o + r * t;
	vec3 n = getNormal(p);
	return vec4(n,t);
}

vec3 getColor(vec3 o,vec3 r,vec4 d){
	float t = d.w;
	vec3 n = d.xyz;
	float a = dot(r,n);
	vec3 bc = vec3(1. - a);
	vec3 cc;
	vec3 p = o + r * t;
	cc = sin(p) * 0.5 + 0.5;
	bc *= cc;
	float fog = 1./(1. + t * t * 0.1);
	return vec3(bc * fog);
}

vec3 cam(){
	vec3 c = vec3(0.,0.,-1.5);
	return c;
}

vec3 ray (vec2 uv,float z){
	vec3 r = normalize(vec3(uv,z));
	return r;
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy * 2.- resolution.xy) / resolution.y;
	vec3 o = cam();
	vec3 r = ray(uv,1.5);
	vec4 d = trace(o,r);
	vec3 color = getColor(o,r,d);
	gl_FragColor = vec4( color, 1.0 );

}