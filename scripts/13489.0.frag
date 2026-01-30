#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
const float pi=3.14159265359;
const vec3 c1=vec3(0.7,0.7,0.7);
const vec3 c2=vec3(0.0,0.6,0.8);

void main( void ) {
	vec3 color;
	vec2 pos = (( gl_FragCoord.xy/resolution.xy )-0.5)*2.0;
	pos.x=pos.x*resolution.x/resolution.y;
	float l=length(pos);
	vec3 uc1=c1+0.6*(sin(time*1.1)+cos(0.11*time)+0.1*atan(2.7*cos(time*0.5)))*c1;
	vec3 uc2=c2+0.6*(cos(time*1.4)+sin(0.13*time)+0.1*atan(3.3*cos(time*0.5)))*c2;
	float f=fract((atan(pos.x,pos.y)+fract(-time/(3.0))*pi+3.5/sqrt(l))/pi*3.5)*16.0;
	if((f<2.0&&f>1.0) || (f>13.0&&f<14.0)){
		color=uc1;
	}else{
		color=uc2;
	}	
	f=abs(fract(f-0.5)*2.0-1.0);
	f=sqrt(-f*f+2.0*f)*sqrt(l);
	gl_FragColor=vec4(f*f*color.r,f*l*color.g,f*l*color.b,1.0);
}