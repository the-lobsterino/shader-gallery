#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(1.0);
	
	position.y -= .5;
	
	position.y += pow(sin(tan(position.x + time) ) / 5.0 / position.x, sin(time)); 
//	position.y += pow(2., sin(position.x + time)) / time;
	// position.y += cos(position.x + time) / 5.0;
	
	color *= 1. - pow(abs(position.y), 0.2);

	gl_FragColor = vec4( color.r * 0.2, color.g * 0.2, color.b * 0.8, 1.0 );

}