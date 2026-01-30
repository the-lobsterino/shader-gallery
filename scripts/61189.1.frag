#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	
	
	position = vec2( atan(position.y,position.x), dot(position,position) );
	
	//position = normalize(position);
	
	float num = 10.0;
	float frequency = 6.28;

	vec3 color = vec3(
		sin(frequency * position.x + 0.0) * 0.5 + 0.5,
		sin(frequency * position.x + 2.0) * 0.5 + 0.5,
		sin(frequency * position.x + 4.0) * 0.5 + 0.5
	);
	
	color += vec3(position.y);// * 2.0 - 1.0);
	
	color = vec3(
		floor(color.r * num) / num,
		floor(color.g * num) / num,
		floor(color.b * num) / num
	);
	
	color = fract(color);

	gl_FragColor = vec4( color, 1.0 );

}