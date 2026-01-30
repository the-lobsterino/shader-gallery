// 050720N WOOD TEXTURE - it takes a while...

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	position.x = cos(.01*time*position.x) + sin(.01*time*position.y);
	position.y = sin(.01*time*position.y) + cos(.01*time*position.x);
	
	gl_FragColor = vec4( vec3(position.x, position.y, .5), 1. );

}