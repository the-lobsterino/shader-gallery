// simple maze practice
// by: @amagitakayosi

// this is a practice learning how to create maze in short code
// like Xor's artwork https://www.shadertoy.com/view/7dVyDh

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float time;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = position * 2. - 1.;
	p.x *= resolution.x / resolution.y;

	vec2 p2 = floor(p * 8.);
	p = fract(p * 8.);
	
	#define N(x) (fract(sin(dot(x, vec2(375.,479.)) * 292.))
	float dir = sign(N(p2)) - .5);	

	float t = smoothstep(0.1, .9, fract(time)) + floor(time);
	float dir2 = sign(N(p2 + sin(floor(time)))) - .5);	
	float offset = t * dir2;
	
	vec4 c;	
	c += smoothstep(.2,.22, abs(fract(p.x + dir * p.y + offset) - .5));	
	gl_FragColor =c;
}