//--- ceramic wall ---
// by Catzpaw 2016
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FAR 50.
#define TILE .1
#define PITCH 699.
#define SPEED 0.

//utilities
vec3 rotX(vec3 p,float a){return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a));}
vec3 rotY(vec3 p,float a){return vec3(p.x*cos(a)-p.z*sin(a),p.y,p.x*sin(a)+p.z*cos(a));}
vec3 rotZ(vec3 p,float a){return vec3(p.x*cos(a)-p.y*sin(a), p.x*sin(a)+p.y*cos(a), p.z);}
vec2 hash(vec2 p){return fract(sin(mat2(12.,23.,44.,61.)*p)*52.);}

//texture & normal map
bool wall(vec2 p,inout vec3 c,inout vec3 n){
	vec2 s=floor(p/TILE);
	p=mod(p,TILE);
	vec2 e=clamp(abs(p/TILE)*20.,0.,1.);
	p+=hash(s)*TILE-TILE;
	float t=mod(length(p)*PITCH-time*SPEED,6.28);
	c=vec3(.8-sin(t)*.4)*c*e.x*e.y;
	n=rotY(rotX(vec3(0,1,0),cos(t)/1.),3.14-atan(p.x,p.y))*e.x*e.y;
	return true;
}

//main
void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec2 m=mouse*2.-1.;
	vec3 finalColor=vec3(0);

	vec3 ld=rotX(vec3(0,1,0),1.3);
	vec3 lp=normalize(vec3(m.x,1,m.y)-vec3(uv.x,0,uv.y));

	bool hit=false;
	vec3 color=vec3(.3,.2,.2);
	vec3 normal=vec3(0,1,0);
	vec3 fog=vec3(0,0,0);
	float dist=(-uv.y-.5)*FAR;

	hit=wall(uv,color,normal);

	vec3 diffuse=color*dot(ld,normal);
	vec3 specular=pow(dot(lp,normal),60.)*vec3(.5,.6,.7);	
	finalColor=diffuse+specular;
	finalColor=mix(finalColor,fog,dist/FAR);
	
	finalColor+=smoothstep(0.,length(uv-m)*10.,.1)*vec3(.5,.6,.7);
	
	gl_FragColor = vec4(finalColor,1);
}
