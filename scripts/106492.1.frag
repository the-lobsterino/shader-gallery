#extension GL_OES_standard_derivatives : disable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 floor;
varying vec2 pow;

void main( void ) {

	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 5.0;


 
	
	
	
	float color = 1.5;
	color += sin( position.x * cos( time / 15.0 ) * 60.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 1.0 ) * 30.0 ) + cos( position.x * sin( time / 10.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 40.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 15.0 ) * 4.5;

	gl_FragColor = vec4( vec3( color, color * 1.5, sin( color + time / 7.0 ) * 1.75 ), 1.45 );

}