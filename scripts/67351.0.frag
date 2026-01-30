// 030920N Fraktal Art 
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

#define MAX 10.0
void main(){
	vec2 p=surfacePosition;
	p *= 4.0;
	vec2 s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s = vec2((sin(sin(time)*s.x*s.x-s.y*s.y)), (s.x*s.y)) - (s);
	       	l += (s.x*s.x);
	}
	gl_FragColor=vec4(l/MAX);
}