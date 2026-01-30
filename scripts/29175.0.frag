#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / (resolution.xy) * 2. );
	vec3 result;
	float x_pos_in_hex = floor(p.x * 8.) / 2.;
	vec3 white = vec3((1. + sin(time + x_pos_in_hex)) / 2.,
			  (1. + asin(time + x_pos_in_hex)) / 2.,
			  (1. + cos(time + x_pos_in_hex)) / 2.);
	float xPosition_16 = p.x / 16.;
	float restraint = (1. + cos(time + x_pos_in_hex)) / 2.;
	restraint *= 2.;
	if (p.y < restraint)
	{
		result = white;
	}
	
	gl_FragColor = vec4( result, 1.0 );

}