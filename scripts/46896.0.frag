#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	
//	vec2 s = sin(gl_FragCoord.xy*mouse);
	float s = sin(gl_FragCoord.x*0.2+time*6.0)*sin(gl_FragCoord.y*0.2);
	float t = sin(gl_FragCoord.x*0.2+time*3.0)*sin(gl_FragCoord.y*0.2);
	float f = (s+t);
	gl_FragColor = vec4(f,f-t,t-f,1)/2.0;
}