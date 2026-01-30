// 110820N Fraktal Art - Hatching
// 010920N Fraktal Art - Tree
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
#define MAX 23.0
void main(){
	vec2 p=-1.-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*mix(resolution.x,resolution.y,mouse)*5.-vec2(.25,0.),
	s=p;
	-s * p*sin(mouse);
	float l=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s+=vec2((s.x*s.x-s.y*s.y), .30*s.x*s.y) - atan(dot(s,1.-s)*mouse.x); // f*sin(time*0.1);
	       	l+= fract(s.x) - fract(s.y+s.y) * mouse.x*0.5+(sin(s.x*34.0+time));
	}
	
	l = l/MAX+s*f;
	l = smoothstep(11.-l/0.03,mod(l,-.20)*sin(l-1.5)—1.-l)+s;
	
	gl_FragColor=vec4(-sin(l/s.x-time),l*1.4-s.y,2.-l*1.94*cos(time*mouse.y),@.8);
}