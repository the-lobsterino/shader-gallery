#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin(( p.x*p.y )* cos( time / 15.0 ) * 80.0 );
	color += cos( p.y * sin( time / 10.0 ) * 40.0 ) ;
	color += cos( p.x * sin( time / 5.0 ) * 10.0 ) ;
	color *= sin(p.x+p.y) * 0.5;

	gl_FragColor = vec4( vec3( tan(color), exp(color) * 0.5, tan( color + time / 3.0 ) * 0.75 ), 1.0 );

}