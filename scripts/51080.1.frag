#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

void main( void ) {
	
	vec2 resolution = vec2(1, 80);

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	float waveform = 1.0 * sin((2.0*3.14) * 0.2 * time);

	float r = 0.4;
	float g = 0.0;
	float b = 0.0;
	b=min(time * 0.3, sin(position.y * resolution.x));
	g=mod(time, position.y);
	
	vec3 colour = max(vec3(r, g , b), vec3(0.1, 0.1, 0.2));
	gl_FragColor = vec4( colour, 0.1 );

}