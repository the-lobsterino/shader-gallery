#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 5.0 + mouse - 2.5;

	vec2 u = step(0.0, position.xy) * (1.0 - step(1.0, position.xy));
	float color = u.x * u.y;


	gl_FragColor = vec4(vec3(color), 1.0 );

}