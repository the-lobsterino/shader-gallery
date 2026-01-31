#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 truePosition = ( gl_FragCoord.xy / resolution.xy );
	vec2 position = vec2(truePosition.x - 0.5);

	float color = position.x;	
	float color2 = gl_FragCoord.y - 0.5;
	
	//color = sin(position.x) + cos(position.y);
	//color += sqrt(position.x * position.y);
	//float dist = distance(position.xy - 0.5, vec2(0)) - sin(position.y);

	gl_FragColor = vec4( vec3( color2, 0.0, 0.0 ), 1.0 );

}