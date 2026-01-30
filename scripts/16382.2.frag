#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy);

	float color = 1.0;
	if(color < 0.9){
		color = 0.5;
		color += time;
	}
	gl_FragColor = vec4(0.0, 0.0, sin(color), 0.5);

}