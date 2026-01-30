//Kirby Creator 

//Welcome to : multicolor dream 

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = vec2(( gl_FragCoord.x - 0.9 / resolution.x),(gl_FragCoord.y - 0.0 / resolution.y));
	
	float x=position.x;
	float y=position.y;
		
	float color = 0.0;
	color += 10.*sin(10.*x)-cos(5.*y);
	
	for ( int i=0; i < 5; i++) {
		float var=sin(0.5*time)*sin(x*y);
		color -= var;
	}
	
	
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( sin(color), color * 0.2, sin( color / 1.0 ) * 0.75 ), 2.0 );

}