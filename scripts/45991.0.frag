#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float _angle){
	float c = cos(_angle);
	float s = sin(_angle);
	
	return mat2(c,-s,s,c);
}

void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution.xy;
	float t = time;
	
	st-=0.5;
	st.x*=resolution.x/resolution.y;
	st = rot(t * PI/2.) * st;
	st+=0.5;
	
	
	//st = st * 2.0 - 1.0;
	
	vec3 c;
	vec3 d;
	
	float l = length(0.5-st);
	
	for(int i=0; i<2; i++){
	vec2 a = st.y + st/l * (1.+cos(st.x-0.09)/PI)/10.+sin(t/PI-.08*l*pow(3.,6.));
	
	d[i] = 0.03/length(fract(a/l+0.5)-0.5);	
	}
	
	c = d*d/l;
	
	gl_FragColor = vec4(c/l,1.0);
	
}