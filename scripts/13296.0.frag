#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	const float max_iter = 1000.0;
	vec2 c = gl_FragCoord.xy;
	vec2 z;
	float value = 0.0;
	for (float iter = 0.0; iter < max_iter; iter += 1.0)
	{
		z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
		if (dot(z, z) > 4.0) {
			value = iter / max_iter;
		}
	}
	
	value = 0.5 + value / 2.0;

	gl_FragColor = vec4( value, 0.0, 0.0, 1);

}