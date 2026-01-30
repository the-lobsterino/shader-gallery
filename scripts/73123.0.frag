// 230521 necips fire fly
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;


float e = 2.71828182846;
float sinh(float x) { return (pow(e,x) - pow(e,-x)) / 2.0; }
float cosh(float x) { return (pow(e,x) + pow(e,-x)) / 2.0; }
float tanh(float x) { return sinh(x) / cosh(x); }


float sig(float x) { return 0.5 * tanh(x * 0.5); }
vec2 sig(vec2 s) { return vec2(sig(s.x), sig(s.y)); }

#define MAX 10.0
void main(){
	vec2 uv=surfacePosition;
	uv *= 2.0;
	uv /= dot(uv,uv);
	vec2 p = vec2(uv.xy);
	
	
	vec2 s1=p;
	float l1=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s1+=vec2(sig(s1.x*s1.x-s1.y*s1.y), sig(2.0*s1.x*s1.y)) - sig(s1);
	       	l1+= (s1.x) * (s1.x);
	}
	
	l1 /= MAX;	
	// l1 /= MAX;
	float l = l1;
	gl_FragColor=vec4(vec3((l)), 1.);
}