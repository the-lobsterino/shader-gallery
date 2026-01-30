#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position 	= ( gl_FragCoord.xy / resolution.xy );
	position 	*= resolution/min(resolution.x,resolution.y);

	vec3 color = vec3(
		fract(position.x / position.y * time ),
		fract(position.y / position.x * time), 
		cos(time)
		);
	

	gl_FragColor = vec4( color, 1.0 );

}