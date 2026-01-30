// co3moz - fence
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SIZE 50.
#define WIDTH 2.

void main(void){
	vec2 position=2.*gl_FragCoord.xy/resolution.y-1.;
	position*=1.1+sin(time*.4); //Animate
	//position*=.2; //Fixed testing size
	
	vec3 color=vec3(0.);
	if(position.x>0.){
		float t=sin(position.x*SIZE)+sin(position.y*SIZE);
		color.r=smoothstep(0.1*WIDTH,0.,t*t);
	}else{
		vec2 p=position*SIZE*.5;
		color.r=(0.125-abs(sin(p.y+p.x)*sin(p.y-p.x)))*10.;
	}
	
	gl_FragColor=vec4(color, 1.0);
}