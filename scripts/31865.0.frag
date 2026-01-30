#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;

	float position	= floor(uv.y * 16.0);
	float number 	= floor(uv.x * 65535.0);
	float bits 	= extract_bit(number, position);;

	
	gl_FragColor = vec4(bits);
}