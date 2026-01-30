// 110820N Fraktal Art - Hatching
// 010920N Fraktal Art - Tree
precision highp float;
uniform vec2 resolution;
uniform float time;

#define MAX 10.0
void main(){
	vec2 p=-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*5.-vec2(.25,0.),
	s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec2((s.x*s.x-s.y*s.y), 2.0*s.x*s.y) - atan(s); // f*sin(time*0.1);
	       	l+= fract(s.x) * fract(s.y) ; // * (sin(time)));
	}
	gl_FragColor=vec4(l/MAX);
}