#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sss(vec3 p){return length(p-vec3(0.,0.,0.8))-0.28 - sin(time * 2. + p.y * 20.)*0.01;}
mat2 rrr(float a){return mat2(sin(a),cos(a),-cos(a),sin(a));	}
vec3 nnn(vec3 p){
	vec2 f = vec2(0.001,0.0);
	float c = sss(p);
	return normalize(c - vec3(sss(p-f.xyy),sss(p-f.yxy),sss(p-f.yyx)));}

float mmm(vec3 ro, vec3 rd){
	float res = 0.;
	for(int i = 0; i < 84; i++){
		vec3 p = ro + rd * res;
		res += sss(p);
		if(res > 32.)
			discard; }
	vec3 p = ro + rd * res;
	vec3 n = nnn(p);
	vec3 lp = normalize(vec3(.2,1.,-1.) - p);
	lp.xy*=rrr(-mouse.x*8.);
	float l = clamp(dot(lp,n),0.,1.)*2.5;
	return res*l;}

#define STEP 0.04

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy-0.5 * resolution.xy )/resolution.y;
	vec3 c = vec3(0.);
	vec3 ro = vec3(0.);
	vec3 rd = vec3(uv * 10.5, time*0.15);
	vec3 rd2 = vec3(uv, 1.);
	float t = 0.01;
	for(int i = 0; i < 16; i++)
	{
		vec3 p = ro + rd * t;
		float a = mod(min(pow(sin(t * 550.0), t), length(p)),0.194)/1.9;
		c += vec3(a);
		t += STEP;
	}
	float m = mmm(ro,rd2);
	vec3 c2 = vec3(m);
	c2 -= c;
	gl_FragColor = vec4(c2, 1.0 ); }