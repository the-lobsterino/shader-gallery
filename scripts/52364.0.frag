#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = exp2(-vec3(1.0, 0.8, 0.1) / position.x);
	color = (mat3(0.0, 1.0, 0.0,
		      0.0, 1.0, 0.5,
		      1.0, 0.0, 0.2) * color);

	gl_FragColor = vec4(color , 1.0 );

}