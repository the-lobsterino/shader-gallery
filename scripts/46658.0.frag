#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= .5;
	
	float angle = atan( position.y,position.x );
	angle += 3.14;
	
	if(angle > mod(time*3.-12.*dot(position,position),6.28) ){
		angle = 1.;
	}else{
		angle = 0.;
	}
	

	gl_FragColor = vec4( vec3( angle ), 1.0 );

}