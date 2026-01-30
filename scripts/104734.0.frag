#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float TIME_MOD = 10.0;
	
	float TIME_SCALE = 0.01;
	
	float t =  mod(time*TIME_SCALE, TIME_MOD) - TIME_MOD * 0.5;
	
	vec3 col = vec3(0.0);
	
	col += vec3(
		mod(gl_FragCoord.x, t) * mod(gl_FragCoord.y, t)*mouse.x,
		mod(gl_FragCoord.x, t) * mod(gl_FragCoord.y, t)*mouse.y,
		0.2
	);


	gl_FragColor = vec4(col, 1.0 );

}