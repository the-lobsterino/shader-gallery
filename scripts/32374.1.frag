#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4(0);
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 center = vec2(0.5, 0.5);		
	
	float r = 500.0;
	float R = 0.2;
	float t = - time * 3.0;
	t *= 0.1; 
	for(int i=0; i<14; i++)
	{
		
		vec2 center = center + R * vec2(cos(t), sin(t) * 0.5);
		
		float color = length(uv - center);
		color = pow(1.0 - color * 0.12, r);
		gl_FragColor += vec4( color );

		t += 0.15;
		r *= 1.2;
	}
	
}

// need to initialize gl_FragColor to 0 or else see thumbnail