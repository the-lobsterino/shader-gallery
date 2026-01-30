// N050920N Necip's Fraktal Art : https://sites.google.com/view/necips/
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

#define MAX 10.0
void main(){
	vec2 uv=surfacePosition;
	uv *= 2.0;
	uv /= dot(uv,uv);
	vec2 p = vec2(uv.xy);
	
	vec2 s1=p;
	float l1=0.;
	for (float f=0.0;f<MAX;f+=1.){
		s1+=vec2(atan(s1.x*s1.x-s1.y*s1.y), atan(2.0*s1.x*s1.y)) - atan(s1);
	       	l1+= (s1.x) * (s1.x);
	}
	
	l1 /= MAX;	
	l1 /= MAX;
	float l = l1;
	gl_FragColor=vec4(vec3((1.-11.*l)), 1.);
}