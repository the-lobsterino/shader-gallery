#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//float c =(((gl_FragCoord.x-mouse.x*resolution.x)*(gl_FragCoord.x-mouse.x*resolution.x))+((gl_FragCoord.y-mouse.y*resolution.y)*(gl_FragCoord.y-mouse.y*resolution.y)))/2500.;
	float c=length(gl_FragCoord.xy-mouse*resolution)/50.;
	gl_FragColor=vec4(0.1/abs(c-1.));
//	gl_FragColor=gl_FragCoord.xxxx;

/*	
	}vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
*/
}