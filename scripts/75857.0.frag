#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.123234565453;
	color += sin( position.x * cos( time / 15.234364 ) * 80.0 ) + cos( position.y * cos( time / 15.3908078908 ) * 10.0567887654345 );
	color += sin( position.y * sin( time / 10.07676546789 ) * 40.0878646) + cos( position.x * sin( time / 25.09008877890 ) * 40.02345678765432123456);
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.043424189);
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5424343, sin( color + time / 3.33333 ) * 0.2421567), 1.2322432435 );

}