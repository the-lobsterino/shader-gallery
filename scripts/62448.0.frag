// Necip's first experiment to simulate waves like in this video: https://www.youtube.com/watch?v=WDxMas784iY
// Who can give me a hand? :)


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
	for(float fi = 0.0; fi < 3.0; ++fi){	
		float offset = fi * PI / sin(time);
		color += 0.002 / abs(p.y + sin(p.x * 10.0 + t + offset) * 0.5); // * color;
	}
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}