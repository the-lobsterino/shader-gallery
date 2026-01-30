#extension GL_OES_standard_derivatives : enable

precision highp float;

#define PI 3.14159265
#define tPI 2.0 * PI

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float x = position.x;
	float y = position.y;
x+=time*0.2;
	
	vec3 col = vec3(0.,0.,0.7);
	gl_FragColor = vec4(
		col*vec3(
			step(cos(x * tPI * 2.0  * 2.0), sin(y * tPI * 4.0 + (sin(y * tPI * 2.0) + 2.0) * 2.0))
		), 
		1.0
	);

}