#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + 0.04 * vec2(cos(time / PI ), sin(time));
	p.x *= resolution.x / resolution.y;
	p = p * 2.0 - 2.0;
	p.y = p.y + 1.0;
	
	vec3 col = vec3(1.0);
	float r = length(p);
	float a = atan(p.x, p.y);
	float s = 0.5 + 0.5 * sin(a * 16.0 + time);
	float d = 0.5 + 0.2 * pow(s, 1.3);
	
	
	float f = step(r, d);
	col = vec3(f);
	col = mix(vec3(1.0), vec3(0.9, 0.8, 0.1), f);
	
	vec2 e = vec2(p.x - 0.15, p.y);
	 
	
	gl_FragColor = vec4 ( col, 1.0);

}