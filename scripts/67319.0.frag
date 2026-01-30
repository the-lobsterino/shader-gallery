// 110820N Fraktal Art - Hatching
// 010920N Fraktal Art - Tree
precision highp float;
uniform vec2 resolution;
uniform float time;

#define MAX 12.0
void main(){
	vec2 p=-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*5.-vec2(.25,0.),
	s=p;
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec2((s.x*s.x-s.y*s.y), 2.0*s.x*s.y) - atan(s); // f*sin(time*0.1);
	       	l+= fract(s.x) * fract(s.y) * 1.0+(sin(s.x*34.0+time));
	}
	
	l = l/MAX;
	l = smoothstep(l/0.50,mod(l,-.20)*sin(l-1.5),1.-l);
	
	gl_FragColor=vec4(sin(l/2.-time),l*1.4,1.-l*0.94,0.8);
}