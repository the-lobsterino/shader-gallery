// 110820N Fraktal Art - Hatching
// 010920N Fraktal Art - A strange beeing with an eye looking up and giant teeths
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

#define MAX 10.0
void main(){
	vec2 p=surfacePosition;
	p *= 18.0;
	vec2 s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec2(atan(s.x*s.x-s.y*s.y), atan(2.0*s.x*s.y)) - atan(s);
	       	l+= (s.x) * (s.y);
	}
	gl_FragColor=vec4(l/MAX);
}