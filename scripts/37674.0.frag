#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
/*
Bubble mapped to a mouse
Made by David Deer
*/
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {
	float Distance = distance(gl_FragCoord.xy, mouse.xy * resolution.xy) / float(resolution.xy * 2.0);
	float color = sin(acos(Distance*10.0));
	if(Distance * 10.0 >= 1.0)color = 1.0;
	gl_FragColor = vec4(color, color, color, 0.0);
}