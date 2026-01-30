#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.14159265359;

float distSqrScaled(vec2 p1, vec2 p2) {
	return (p2.x - p1.x)*(p2.x - p1.x)*resolution.x/resolution.y + (p2.y - p1.y)*(p2.y - p1.y)*resolution.y/resolution.x;
}

// <3
void main(void) {
	vec2 centered = (gl_FragCoord.xy / resolution.xy)*2.0 - 1.0;

	float intensity = 0.0;
	for (int i = 0; i < 500; i++) {
		float t = (2.0*pi/500.0) * float(i);
	
		float x = 16.0*pow(sin(t), 3.0)*0.5;
		float y = (13.0*cos(t) - 5.0*cos(2.0*t) - 2.0*cos(3.0*t) - cos(4.0*t));
	
		intensity = max(intensity, (1.0 - (3000.0 + 500.0*sin(3.0*time))*distSqrScaled(centered, 0.03*vec2(x, y))));
	}

	gl_FragColor = vec4(vec3(1.0, 0.2078, 0.8)*(0.15 + intensity*0.75), 1.0);
}