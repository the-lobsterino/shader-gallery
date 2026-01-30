#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const mat3 matr = mat3(0.0, 0.0, 0.0,
		       0.0, 0.0, 0.0,
		       0.0, 1.0, 1.0);

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(1.0, 1.0, 1.0) * position.x;
	     color = matr * color;
	     

	gl_FragColor = vec4(color, 1.0 );
}