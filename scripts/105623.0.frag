#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / min(resolution.x, resolution.y));

	vec4 color = vec4(0.0);
	color += 

	gl_FragColor = color;

}