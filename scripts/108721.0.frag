#extension GL_OES_standard_derivatives : enable

/*
it warms the house
*/

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	float vertical = uv.y/2.0+0.5;
	
	vertical = pow(vertical, 10.0);

	float color = 0.0;
	
	color += pow(sin(uv.x*20.0*3.14159), 3.0)/2.0;
	color += 0.5;
	color /= 2.0;
	color += 0.5 * tan(vertical*3.14159/4.0);
	
	color = pow(color, 1.5);

	gl_FragColor = vec4( vec3(color), 1.0 );

}