#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 10.;

	vec4 color = vec4(1., 0.5, 0.5, 1.);
	color *= cos(pos.x * time + cos(pos.y + time));

	gl_FragColor = color;

}