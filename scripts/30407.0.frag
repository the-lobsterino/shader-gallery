#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float counter;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	counter = counter + 0.01;
	

	gl_FragColor = vec4( counter, 0 ,0, 1.0 );
	if (counter >= 1.0)
		counter = 0.0;
}