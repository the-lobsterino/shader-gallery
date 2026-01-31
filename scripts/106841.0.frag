#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI2 2.0 * 3.14

float wave(vec2 center, float rad, float phase)
{
	float radius = distance(gl_FragCoord.xy / resolution, center);
	return (sin(PI2 / rad * radius + phase) + 1.0) / 2.0;
}


void main( void ) {
	vec4 color = vec4(0.0, 0, 1, 1);
	vec4 color2 = vec4(0.0, 0.5, 1, 1);
	
	vec2 source1 = vec2(0.6, 0.6);
	vec2 source2 = vec2(0.2, 0.4);
	vec2 source3 = vec2(0.7, 0.1);
	
	float phase1 = PI2/5.0 * time;
	float phase2 = PI2/3.0 * time + PI2 / 4.0;
	float phase3 = PI2/2.0 * time + PI2 / 6.0;
	
	float alpha = (0.33 * wave(source1, 0.1, phase1) + 0.33 * wave(source2, 0.1, phase2) + 0.33 * wave(source3, 0.1, phase3));
	
	gl_FragColor =  alpha * color + (1.0 - alpha) * color2;

}