precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

#define MAX 4.0
void main(){
	vec2 p=surfacePosition;
	p *= 4.0;	
	vec2 s=p;
	float l2 = 0.0;
	for (float f=1.0;f<MAX;f+=1.) {
		s+= vec2(sin(sin(p.x*p.x) - sin(p.y*p.y)) * sin(p.x*p.y), sin(p.x*p.y)) - length(s)*sin(time);
		s=sin(s);
		l2+=length(sin(s+time));
	}
	
	gl_FragColor=vec4(l2/MAX);
}