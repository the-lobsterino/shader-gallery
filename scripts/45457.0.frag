#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

	float r = 1.0;
	if(position.x < 10.0){
		r=0.0;	
	}
	gl_FragColor = vec4( r,0,0, 1.0 );

}