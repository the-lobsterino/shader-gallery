#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color1 = 0.0;
	float color2 = 0.0;
	float color3 = 0.0;
	color1 += sin(position.x +1.0)/sin(time/6.0);
	color1 += sin(position.y *2.0)/sin(time/5.0);
	color2 += sin(position.x +3.0)/sin(time/4.0);
	color2 += sin(position.y *4.0)/sin(time/3.0);
	color3 += sin(position.x +5.0)/sin(time/2.0);
	color3 += sin(position.y *6.0)/sin(time/1.0);
	
	color1 += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color2 += sin( position.y * sin( time / 5.0 ) * 15.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color3 += sin( position.x * position.y *  sin( time / 5.0 ) * 5.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color1, color2, color3 ), 1.0 );

}