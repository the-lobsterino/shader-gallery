// 110820N Fraktal Art - Hatching
// 010920N Fraktal Art - Tree Vers 1.3 - An other new Mandelbrot is born! :)
// 020920N Fraktal Art - Matrix II Type "Realism 2"
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

#define MAX 6.0
void main(){
	vec2 p=surfacePosition;
	p /= dot(p,p);
	p *= 1.0+sin(time);
	vec2 s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=0.125){
		s+=vec2(abs(sin(s.x+s.y)), abs(s.y)) - (s);
	       	l+= fract(s.x-s.y);
	}
	gl_FragColor=vec4(0.125*l/MAX);
}