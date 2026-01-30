#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec4 color = vec4(1.0);
	color.rgba=exp2(vec4(position.y));
	color.rgba = vec4(1.0) * (log2(position.y+1.0) / log2(2.0));
	color.rgba=vec4(position.y);
	gl_FragColor = color;
}