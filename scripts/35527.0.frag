#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATIONS 100
#define scale 4.0

//#define MANDELSHIP


void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p -= .5;
	p *= scale;
	vec2 c = scale * (mouse - .5);
	
	vec2 z1 = p;
	vec2 z2 = p;
	for (int i = 0; i < ITERATIONS; i++) {
		z1 = vec2(z1.x * z1.x - z1.y * z1.y, 2.0 * z1.x * z1.y);
		z2 = vec2(z2.x * z2.x - z2.y * z2.y, 2.0 * z2.x * z2.y);
		z1.y = abs(z1.y);
		z2.y = abs(z2.y);
		z1 += p;
		z2 += c;
	}

	float v1 = floor(length(z1));
	float v2 = floor(length(z2));
	
	vec4 color = vec4(v1,v2,0.0,1.0);

	gl_FragColor = color;

}