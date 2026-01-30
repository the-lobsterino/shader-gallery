#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	position = vec2(position.x - .5, position.y - .5);
	
	//if (sqrt(nx*nx + ny*ny) < 0.3) {
	if (dot(position,position) < 0.01) {
	  	gl_FragColor = vec4(1.0,.0,.0,1.0);	
	} else {
		gl_FragColor = vec4(.0,.0,.0,1.0);	
	}
	
	//gl_FragColor = vec4( vec3( position.x ), 1.0 );
	
	
/*
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
*/
}