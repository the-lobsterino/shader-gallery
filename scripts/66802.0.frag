// 110820N Fraktal Universe... stay a while

precision highp float;
uniform vec2 resolution;
uniform float time;

#define MAX 1.0
void main(){
	vec2 p=-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*4.-vec2(.5,0.),
	s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec2((s.x*s.x-s.y*s.y), 2.0*s.x*s.y) + .1*f*sin(0.1*time);
	       	l+=length(s); // s.x + s.y;
	}
	gl_FragColor=vec4(l/MAX);
}