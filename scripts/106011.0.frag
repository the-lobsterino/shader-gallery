#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	// 
	vec3 colormult = vec3(1.0, 0.5, 0.25);
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + time/4.0 ;

	float color = 0.0;
	color += abs(ceil(sin(position.x * 40.0  ) + cos(position.y * 20.0)));
	color += abs(ceil(sin(position.x * 40.0 ) * cos(position.y * 20.0)));

	gl_FragColor = vec4( vec3( color * colormult.x, color * colormult.y, color * colormult.z), 1.0 );
	
}