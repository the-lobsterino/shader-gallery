// Necip's experiments to simulate waves like in this video: https://www.youtube.com/watch?v=WDxMas784iY


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;

	float t = mod(time, resolution.x);
	
	float color = 0.1;
	for(float fi = 0.0; fi < 6.0; ++fi){	
		float offset = fi * PI / (1. + 0.01 * tan(time));
		color += 0.002 / (p.y * abs(p.y + sin(p.x * 10.0 + t + offset) * 0.5));
	}
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}