// 
// JDP

#ifdef GL_ES
precision mediump float;
#endif
#define stripes 25.0
#define stripeColor 16.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float stripeSize =  1.0 / stripes;

	float x;
	
	vec2 a = (gl_FragCoord.x / resolution.xy );

	x = floor(a.y * stripes);
	
	float color = mod(float(x),stripeColor);
	vec3 finalColor = vec3( .11, .22 ,.55) * color;
	gl_FragColor = vec4( finalColor, 1.0 );
}