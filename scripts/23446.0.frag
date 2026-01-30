#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.1;
	
	position.x += sin(time*0.5);
	position.y += sin(time*0.5); 
	
	color += cos(position.x*2.0*position.y*10.0)*5.0 ;
	
	
	

	gl_FragColor = vec4( vec3( color, color * 0.15, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}