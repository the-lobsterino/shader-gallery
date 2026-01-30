#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float tim;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( tim / 15.0 ) * 80.0 ) + cos( position.y * cos( tim / 15.0 ) * 10.0 );
	color += sin( position.y * sin( tim / 10.0 ) * 40.0 ) + cos( position.x * sin( tim / 25.0 ) * 40.0 );
	color += sin( position.x * sin( tim / 5.0 ) * 10.0 ) + sin( position.y * sin( tim / 35.0 ) * 80.0 );
	color *= sin( tim / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + tim / 3.0 ) * 0.75 ), 1.0 );

}