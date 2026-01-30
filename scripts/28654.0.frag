#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
vec2 mouse = vec2(10,10);
vec2 resolution = vec2(1280,720);

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color1 = 0.0;
	color1 += sin( position.x * cos( time / 1.0 ) * 800.0 ) + cos( position.y * cos( time / 15.0 ) * 100.0 );
	color1 += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color1 += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color1 *= sin( time / 10.0 ) * 0.5;
	
	float color2 = 0.0;
	color2 += sin( position.x * cos( time / 1.0 ) * 5.0 ) + cos( position.y * cos( time / 15.0 ) * 1.0 );
	color2 += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color2 += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color2 *= sin( time / 10.0 ) * 0.5;
	
	float color3 = 0.0;
	color3 += sin( position.x * cos( time / 1.0 ) * 10.0 ) + cos( position.y * cos( time / 1.0 ) * 10.0 );
	color3 += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color3 += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color3 *= sin( time / 10.0 ) * 0.5;
	
	gl_FragColor = vec4( vec3( color1, color2 * 0.5, sin( color3 + time / 3.0 ) * 0.75 ), 1.0 );

}