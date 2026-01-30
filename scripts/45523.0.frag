#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smoothCircle(float x, float y, float radius, float blur, vec2 st){
	
	float pct = distance(st, vec2(x, y));
	
	pct = smoothstep(radius, radius + blur, pct);
	
	return pct;	
}


void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution.xy;
	
	st *=  gl_FragCoord.x / resolution.y;
	
	st = st * 2.0 - 0.5;
	
	float pct = pow(distance(st,vec2(0.5)), distance(st, vec2(abs(sin(time * 0.4))) * 0.5));
	
	//pct *= smoothCircle(0.5, 0.5, sin(time)*0.1, abs(sin(time*0.01)), st);	
	
	vec3 color = vec3(pct);
	
	gl_FragColor = vec4(vec3(fract(pct * 33.33)), 1.0);
	
}