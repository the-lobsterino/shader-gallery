#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = 1.0 * (abs(sin(time)) - position.x);
	color += 1.0 - color * mod(position.y * resolution.y, 32.0);
	float iColor = 0.5 - color;
	vec3 vColor = vec3(color * 0.2, iColor * 0.2, iColor * 0.2);
	gl_FragColor = vec4(vColor, 1.0 );

}