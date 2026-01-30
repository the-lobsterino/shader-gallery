//--- noise
// by Catzpaw 2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define DEPTH 3.0
#define SCALE 2.5
#define POWER 9.0

vec3 rotX(vec3 p,float a){return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a));}
vec3 rotY(vec3 p,float a){return vec3(p.x*cos(a)-p.z*sin(a),p.y,p.x*sin(a)+p.z*cos(a));}
vec3 rotZ(vec3 p,float a){return vec3(p.x*cos(a)-p.y*sin(a), p.x*sin(a)+p.y*cos(a), p.z);}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(0);

	vec3 p=vec3(uv,DEPTH);uv*=SCALE;
	p=rotY(p,p.y);
	p.x+=sin(uv.y+time*.61);
	p=rotZ(p,time*.31);
	p.y+=sin(uv.x+time*.71);
	p=rotX(p,p.x);
	float c=pow(dot(p.xy,p.zz),POWER);
	finalColor=vec3(fract(c),fract(c*29.),fract(c*27.));
	
	gl_FragColor = vec4(finalColor,1);
}
