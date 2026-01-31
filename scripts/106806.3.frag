#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 10.;

	float d=length(pos)*0.5;
	vec4 color = vec4(0.8, 1.2, 0.5, 0.9);
	color *= cos(sin(d*0.1+pos.x*.2+pos.y)*0.055* time + cos(pos.x*0.5+pos.y + time+d*0.4));

	gl_FragColor = color;

}