#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 center = vec2(0.55, 0.475);		
	
	float r = 150.0;
	float R = 0.3;
	float t = - time * 0.125;
	
	for(int i=0; i<140; i++)
	{
		vec2 center = center + R * vec2(cos(t*13.1), sin(t*8.2));
		float color = length(uv - center);
		color = pow(1.0 - color * 0.12, r);
		gl_FragColor += vec4( color );

		t += 0.15;
		r *= 1.1;
	}
	
}

// need to initialize gl_FragColor to 0 or else see thumbnail