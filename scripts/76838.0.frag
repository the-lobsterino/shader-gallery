#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	const float pi = 3.14159;
	
	
	vec2 position = gl_FragCoord.xy / resolution.y;
	position -= 0.5 * resolution.xy / resolution.y;

	
	vec3 color = vec3(cos(100.*atan(position.y/position.x)), cos(100.*atan(position.y/position.x) + pi/3.), cos(100.*atan(position.y/position.x) - pi/3.));
	
	
	float intensity;
	
	intensity = sin(length(position*1000.)-1.*time);
	
	
	color *= intensity;
	

	gl_FragColor = vec4(color, 1.0 );

}