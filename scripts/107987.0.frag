#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define THICCNESS 10.0

void main( void ) {
	vec2 p1 = vec2(200,200);
	vec2 p2 = mouse;
	vec2 p3 = gl_FragCoord.xy;
	vec2 p12 = p2 - p1;
	vec2 p13 = p3 - p1;
	float dotp = dot(p12, p13);
	float d = dotp / length(p12);
	
	vec2 c = p1 + normalize(p12)*d;
	
	if(length(c-p3) < THICCNESS) {
		gl_FragColor = vec4(1);
	}else {
		gl_FragColor = vec4(0.4);
	}
}