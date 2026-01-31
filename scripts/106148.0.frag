#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	float divide = p.x / p.y;

	r += .7 - distance(sin(time * 0.1 * PI) + divide + p.x * p.y + p.y * pow(p.x, sin(time * time)), 1.5) * 2.0;
	g += .7 - distance(cos(time * 0.1 * PI) + divide * p.x + p.y * pow(p.x, cos(time)), 3.5)* 2.0;
	b += .7 - distance(sin(time * 0.1 * PI) + divide * p.x + p.y * pow(p.x, sin(time)), 2.5) * 2.0;
	
	vec3 color = vec3(r, g, b);
	
	gl_FragColor = vec4(color, 1.0);

}