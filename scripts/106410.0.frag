#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec4 col = vec4(1.);
	col *= sin((pos.x + cos(pos.y * time))* 100.);
	gl_FragColor = col;

}