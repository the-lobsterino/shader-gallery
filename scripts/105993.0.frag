#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + time/8.0;

	float color = 0.0;
	color += abs(floor(sin(position.x * 160.0 + sin(floor(position.y * 20.0 ) + time) * 40.0) + cos( position.y * 80.0 + cos(floor(position.x * 40.0) + time) * 40.0)));

	gl_FragColor = vec4( vec3(color, color*0.5, 0), 1.0 );

}