#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 1000.0;

	float opacity = 0.0;
	
	if ( mouse.y > position.y) {
		opacity = 1.0;
	}
	
	
	
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );

	gl_FragColor = vec4( 0.0, opacity, 0, opacity);

}