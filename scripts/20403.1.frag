#ifdef GL_ES
precision mediump float;
#endif

// By Lucas Myers

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	vec2 center = vec2(0.5, 0.5);
	
	color = sin(distance(position, center) * 64.0 + time * 8.0);

	gl_FragColor = vec4( vec3(color, color, color), 1.0 );

}