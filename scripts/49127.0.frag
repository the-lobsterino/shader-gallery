#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define BG vec4(1.0)
#define C1 vec4(0xFF, 0xEA - 0x1A, 0xBA - 0x10, 0xFF) / 256.0
#define C2 vec4(0xFF, 0xEA - 0x10, 0xBA, 0xFF) / 256.0
#define C3 vec4(0xFF, 0xE8 - 0x09, 0xBB, 0xFF) / 256.0


void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	p *= 5.0;
	p.x -= time * 2.7;
	
	float sA = step(p.y, sin(p.x + time));
	float sB = step(p.y, sin(p.x - time));
	float sAB = step(p.y, sin(p.x - time) * sin(p.x + time));
	
	float w1 = sAB;
	float m2 = 1.0 - w1; // mask
	float w2 = sA * m2;
	
	float m3 = 1.0 - max(w1, w2);
	float w3 = sB * m3;
	
	vec4 c1 = C3 * w1;
	vec4 c2 = C2 * w2;
	vec4 c3 = C1 * w3;
	float w = 1.0 - max(w1, max(w2, w3));

	gl_FragColor = c1 * c1.a + c2 * c2.a + c3 * c3.a + w * BG;
}