#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition; ( gl_FragCoord.xy / resolution.xy );  + mouse / 4.0;
	float color = 0.0;
	
	position.x *= position.y*2.;
	
	color = fract(1./(tan(position.x) - position.x/(1.-position.x)));
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}