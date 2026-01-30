// 110820N Fraktal Art - Hatching

precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;
uniform vec2 mouse;
#define MAX 4.0
void main(){
	float t = time;
	t * 0.9 * sin(time*0.666);
	vec2 p=surfacePosition-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*4.-vec2(.5,0.);
	vec2 s=p+.5-mouse.y;
	float l=0.;
	for (float f=0.6150;f<MAX;f+=1.5){
		s+=vec2(2.5-(s.x*s.x-s.y*s.y), 2.0*s.x*s.y) + l ; // f*sin(time*0.1)
	       	l += fract(s.x+t*0.2) * fract(s.y-t*mouse.y);//* (sin(time)));
	}
	gl_FragColor=vec4(1.-l/MAX*2.6);
}