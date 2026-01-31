#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.141592653589793

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	
	p.x += sin(time + p.y * 9.) * .1;
	
	color += smoothstep(0.45, 0.5, p.x);
	color -= smoothstep(0.5, 0.55, p.x);
	
	float r = sin(color * time * 1. * p.y * .3);
	float g = sin(color * time * 3. *.1 * p.y * .1);
	float b = sin(color * time * 2. * .3 * p.y * .01);

	gl_FragColor = vec4(vec3(r, g,  b), 1.0 );

}