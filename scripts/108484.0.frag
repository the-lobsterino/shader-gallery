#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
const float pi=3.14159265359;
const vec3 c1=vec3(12.5,12.0,0.0);
const vec3 c2=vec3(0.1,0.4,1.0);

void main( void ) {
	vec3 color;
	vec2 pos = (( gl_FragCoord.xy/resolution.xy )-0.5)*2.0;
	float l=length(pos);
	float f=fract((atan(pos.x,pos.y)+fract(-time/2.0)*pi+2.0/sqrt(l))/pi*1.0)*2.0;
	if(f<5.0){
		color=c1;
	}else{
		color=c2;
	}	
	f=abs(fract(f-2.5)*5.0-1.0);
	f=sqrt(-f*f+2.0*f)*sqrt(l);
	gl_FragColor=vec4(f*f*color.r,f*l*color.g,f*l*color.b,1.0);
}