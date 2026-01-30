#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14159265

vec2 p;
float bt;


float seed=0.1;
float rand(){
    seed+=fract(sin(seed)*seed*1000.0)+.123;
	
    return mod(seed,1.0);
}


//No I don't know why he loks so creepy

float thicc=.003;
vec3 color=vec3(1.);
vec3 border=vec3(.4);



void diff(float p){
	if( (p)<thicc)
		gl_FragColor.rgb=color;
}
void line(vec2 a, vec2 b){
	
	vec2 q=p-a;
	
	vec2 r=normalize(b-a);
	
	if(dot(r,q)<0.){
		diff(length(q));
		return;
	}
	
	if(dot(r,q)>length(b-a)){
		diff(length(p-b));
		return;
	}
	
	vec2 rr=vec2(r.y,-r.x);
	
	
	
	
	diff(abs(dot(rr,q)));
	

}
void circle(vec2 m,float r){
	vec2 q=p-m;
	vec3 c=color;
	diff(length(q)-r);
	color=border;
	diff(abs(length(q)-r));
	color=c;
}

void main() {
	p=gl_FragCoord.xy/resolution.y;
	
	bt=mod(time,4.*PI);
	gl_FragColor.rgb=vec3(0.);
	
	vec2 last;


	//Body
	circle(vec2(1.,.250),.230);	
	circle(vec2(1.,.520),.180);
	circle(vec2(1.,.75),.13);
	
	//Nose
	color=vec3(1.,.4,.0);
	line(vec2(1,.720),vec2(1.020,.740));		
	line(vec2(1,.720),vec2(.980,.740));		
	line(vec2(1,.720),vec2(.980,.740));		
	line(vec2(1.020,.740),vec2(.980,.740));		


	border=vec3(0);
	color=vec3(1);
	thicc=.006;
	//Eyes
	
	circle(vec2(.930,.800),.014);
	circle(vec2(1.060,.800),.014);

	color=vec3(.0);
	thicc=0.;
	
	//mouth
	for(float x=0.;x<.1300;x+=.010)
		circle(vec2(.930+x,.680+cos(x*40.0+.5)*.014),.005);	
	
	
	//buttons
	for(float x=0.02;x<.450;x+=.070)
		circle(vec2(1.000,.150+x),0.01);	


	color=vec3(0.9);
	thicc=0.;
	
	//snowflakes
	for(int i=0;i<99;i++){
	     circle(vec2(rand()*2.0,mod(rand()-time,1.0)),0.01);
	}
		
	gl_FragColor.a=1.0;
		
	

}