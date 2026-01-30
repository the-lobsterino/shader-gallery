#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535897932384626433832795 
#define BPM 1228.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 p = vec2(gl_FragCoord.xy / resolution.y);
	vec3 sync = vec3((sin(time * (60.0 / BPM * 4.0)) + 1.0) * 0.5);
	vec3 sync1 = vec3(abs(sin(time * (60.0 / BPM * 4.0))));
	vec3 destColor = vec3(0.0);
	
	vec3 point0 = vec3(0.05 / length(p - vec2(sin(0.5 * time + 0.0) + 0.75, abs(sync1) * 0.8 + 0.1)));
	vec3 point1 = vec3(0.05 / length(p - vec2(sin(0.5 * time + 1.0) + 0.844, abs(sync1)* 0.8 + 0.1)));
	vec3 point2 = vec3(0.05 / length(p - vec2(sin(0.5 * time + 2.0) + 0.844, abs(cos(1.5 * time))* 0.8 + 0.1)));
	point0 *= vec3(0.25, 0.25, 1.0);
	point1 *= vec3(0.25, 0.5, 0.25);
	point2 *= vec3(0.25, 0.75, 1.0);
	
	
	destColor += vec3(0.25, 0.5, 1.0);
	destColor = point0 + point1 + point2;
	destColor *= sync;
	
	gl_FragColor = vec4(destColor, 1.0);
	

}