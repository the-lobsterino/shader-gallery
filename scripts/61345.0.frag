#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main(void){
	
	vec2 p = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float t = (time * 0.1);
	float PI = 3.1415;
	float f = (sin((p.x*p.x + p.y*p.y) * PI * t)) -
		  (cos((p.x*p.y + p.y*p.x) * PI * t));
	
	gl_FragColor = vec4(vec3(f), 1.0);
}