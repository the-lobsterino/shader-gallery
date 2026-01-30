#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float k_e = 8.99E9;

float charge = 0.1;
vec2 point = vec2(0.5, 0.5);
	
float coulomb(float c, vec2 source, vec2 test)
{
	float dist = length(source - test);
	return c /(dist * dist);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = abs( coulomb(charge, point, position) );
	
	vec4 base_color = vec4(0.5, 0.0, 0.5, 1.0);
	

	gl_FragColor = color * base_color;

}