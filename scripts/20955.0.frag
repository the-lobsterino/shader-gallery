#ifdef GL_ES
precision mediump float;
#endif

// By Lucas Myers

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
        
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.5;
	vec2 center = vec2(sin(time * 4.0) * 0.5 + 0.5, cos(time * 5.0) * 0.5 + 0.5);
	vec2 center2 = vec2(sin(time * 3.0) * 0.5 + 0.5, cos(time * 2.0) * 0.5 + 0.5);
	
	float thickness1 = sin(time) * 150.0;
	float thickness2 = sin(time * 0.8) * 150.0;
	
	color = sin(distance(position, center) * thickness1);
	color *= sin(distance(position, center2) * thickness2);

	gl_FragColor = vec4( vec3(color, color, color), 1.0 );

}