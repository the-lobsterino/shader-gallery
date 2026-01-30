#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 mousePosition = (mouse.xy / resolution.xy);
	vec2 v = mouse - position;
	
	float red = sin(time / 10.);
	float s = length(v);
	float green = s * sin(time);
	float blue = (1. - s) * (1. - s);
	
	vec4 color = vec4(1.0, 0.0, 0.0, 0.5);
	gl_FragColor = color;

}