#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
		
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;

	if(gl_FragCoord.xy.x < gl_FragCoord.xy.y) {r = 9.0;}
	if(gl_FragCoord.xy.x == gl_FragCoord.xy.y) {g = 9.0;}
	if(gl_FragCoord.xy.x > gl_FragCoord.xy.y) {b = 9.0;}
	
//	if(gl_FragCoord.xy.x > 20 && gl_FragCoord.xy.x < 40 && gl_FragCoord.xy.y > 20 && gl_FragCoord.xy.y < 40) { r = 0.0; g = 0.0; b = 0.0; };
	
	gl_FragColor = vec4( vec3(r, g, b), 8.2 );
	
}























	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
