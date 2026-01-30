#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
vec2 center=vec2(0.5,0.5);
float radius=0.25;
float thickness=0.02;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	radius = radius * ( 1.0 - 0.5* sin(time/5.0));

	float range= distance(position,center);
	
	if(range<radius && range > radius - thickness)
		gl_FragColor = vec4( 1.0,0.0,1.0,1.0 );
	else
		gl_FragColor = vec4( 0.0,0.0,0.0,1.0 );

}