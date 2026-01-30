#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 2.0;
	float color = 3.0;
	color += sin( position.x * cos( time / 100.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 50.0 ) * 25. ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 15.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 3.0 ) * 3.0;
	float x = 0.0;
	for (float n=0.1; n<0.2; n += 0.1){
		gl_FragColor = vec4(vec3(1.0*sin(time)*x, 0.5*sin(time)*x, sin(time)*x), 1.0);
		}
	
	//gl_FragColor = vec4(vec3(1.0*sin(time), 0.5*sin(time), sin(time), 1.0);
	gl_FragColor = vec4( vec3( color*sin( color + time / 3.0 )*0.001 + 0.0*color*atan( color + time / 3.0 ), 0.06*color*sin( color + time / 3.0 ), 0.3*color*sin( color + time / 3.0 ) * 0.75 ), 1 );

}