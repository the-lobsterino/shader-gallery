#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	//position -= .5;
	//position.x *= resolution.x / resolution.y;
	
	float color;	
	if(position.x > .5 && position.x < .8 ) {
		color = position.y ;
	}
	else{
		color = 1.;
	}
	
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}