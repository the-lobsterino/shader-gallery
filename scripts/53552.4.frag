#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const mat3 matr = mat3(1.2, 0.2, 0.2,
	               0.1, 1.3, 0.02,
	               0.01, 0.02, 1.1);

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0, position.x * 100.0, 0.0);
	     color = color * matr;
	     color /= color + 1.0;

	gl_FragColor = vec4(color, 1.0 );

}