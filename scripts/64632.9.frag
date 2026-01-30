#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	float red = 0.0;
	float blue = 0.0;
	float green = 0.0;
	red += sin(time)*sin(time)*0.1 + cos(position.y);
	blue += cos(time)*cos(time)*0.4;
	green += sin(time)*0.1 + sin(position.x);
	
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 1.0 ) * 0.5;

	gl_FragColor = vec4( vec3( red, blue, green ), 0.0 );

}