#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy * resolution.xy ) * time * -100.1;

	float color = 1.6;
	color += sin( position.x * cos( time / 103240.0 ) / 1.0 ) + cos( position.y * cos( time / 5324.0 ) * 13412.0 );
	color += sin( position.y * sin( time / 100.0 ) / 1.0 ) + cos( position.x * sin( time / 234.0 ) * 312342.0 );
	color += sin( position.x * sin( time / 100.0 ) / 1.0 ) + sin( position.y * sin( time / 3234.0 ) * 113244.0 );
	color *= sin( time / 100.0 ) * 1000.5;

	gl_FragColor = vec4( vec3( color, color * -34210.0, sin( color * time / -1324.0 ) * 1323424.0 ), 1234.0 );

}