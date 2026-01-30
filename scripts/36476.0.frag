//crazy dance
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec3 color = vec3(sin(time * 500.0) * 0.5 + 0.5, sin(time * 500.0 + 2.094) * 0.5 + 0.5, sin(time * 500.0 + 4.1887) * 0.5 + 0.5);

	gl_FragColor = vec4(color, 1.0 );

}