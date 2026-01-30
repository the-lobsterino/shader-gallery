#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float dist = distance(position, vec2(0.5));

	vec3 color = vec3(smoothstep(sin(time + dist * 200.0 * position.y) * dist * 2.0 + 2.0, 0.2, 0.9));

	gl_FragColor = vec4( color, 1.0 );

}