#extension GL_OES_standard_derivatives : disable
#ifdef GL_ES
#endif

precision highp float;
precision mediump float;
precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {


	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 5.0;

	float color = 2.5;
	color += sin( position.x * cos( time / 17.0 ) * 80.0 ) + cos( position.y * cos( time / 1.0 ) * 10.0 );
	color += sin( position.y * sin( time / 19.0 ) * 4.0 ) + cos( position.x * sin( time / 5.0 ) * 4.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 3.0 ) * 80.0 );
	color *= sin( time / 18.0 ) * 3.5;

	
	
	gl_FragColor = vec4( vec3( color, color * 2.5, sin( color + time / 3.0 ) * 3.75 ), 1.5 );

}