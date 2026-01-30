#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	// draw a circle using distance function
	float dist = distance(gl_FragCoord.xy, mouse * resolution);
	float sine_time = sin(time) * 0.5 + 0.5;
	gl_FragColor = vec4( vec3(dist / (sine_time * 150.0)), 1.0 );
}