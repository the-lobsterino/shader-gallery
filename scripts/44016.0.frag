// #gigatron 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p=   gl_FragCoord.xy / resolution.xy  ;
	
	p = floor(p*64.)/64.;

	float color = 0.0;
	color += sin( dot(0.5-length(p.x*2.0),2.0) * cos( time / 5.0 ) * 256.0 )  + cos( 3.*p.y * cos( time / 15.0 ) *40.0 );
	color += cos( dot(p.y,.4) * cos( -time * 0.5 ) * 64.0 ) + cos( p.x * cos( time / 15.0 ) * 16.0 ); ;

	gl_FragColor = vec4( vec3( color*sin(time/2.)*0.2, color*cos(time+p.x) , 3.*sin( color + time / 3.0+p.y ) * 0.75 ), 1.0 );

}