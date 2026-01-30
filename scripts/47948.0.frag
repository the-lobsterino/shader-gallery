#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 3.1415926535897932384626;


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color -= sin( position.x * ( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + tan( position.x * sin( time / 25.0 ) * 40.0 ) * pi;
	color /= sin( position.x * sin( color / pi ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * pi ) * pi - cos(pi);
	color *= sin( time / 10.0 ) * 5.5 + pi - sin(pi); 

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + pi / 3.0 ) * 0.75 ), 1.0 );

}