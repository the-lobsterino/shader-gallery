#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	//vec2 aspect = normalize(resolution);
	vec2 aspect = resolution / 500.0;
	
	vec2 cursor = position - mouse;
	cursor *= aspect;
	
	gl_FragColor = vec4( 
		vec3(
			0.0, 
			0.25 * step(0.1, length(cursor) ), 
			0.0 
		), 
		1.0 
	);

}

























