#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float S = 5.0;
	float r = mod(mod(floor(gl_FragCoord.x/S),2.0) + mod(floor(gl_FragCoord.y/S),2.0),2.0);
	
	//if(gl_FragCoord.y < 20.0)
	//{
	//	r = 0.5;
	//}
	
	gl_FragColor = vec4( r,r,r, 1.0 );

}