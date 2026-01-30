#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec3 a = vec3(1, 0, 0);
	vec3 b = vec3(0, 0, 0);
	
	vec2 up = vec2(0, 1.0 - 2.0 * float(gl_FragCoord.x < resolution.x / 2.0));
	
	float t = 5.0;
	//float fac = 0.5 * cos(time * 1.0) + 0.5;
	
	float fac = mouse.x;
	
	// Calculate angle between fragment and "up"
	vec2 dir = gl_FragCoord.xy - (resolution / 2.0);
	float theta = acos(dot(dir, up) / (length(up) * length(dir)));
	theta = theta + float(gl_FragCoord.x < resolution.x / 2.0) * PI;
	
	// p is either 1.0 or 0.0 depending on position relative to the "wipe"
	float p = float((theta < 2.0 * PI * fac));
	gl_FragColor = vec4(mix(a, b, p), 1.0);

}