#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 position	= ( gl_FragCoord.xy / resolution.xy );
	float color 	= sin ( position.x*time+cos(time*10.0)) ;
	gl_FragColor	= vec4( color, color, color , 1.0 );

}