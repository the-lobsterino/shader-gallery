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

	position.x = sin(.1*time*position.x) + cos(.1*time*position.y);
	position.y = cos(.1*time*position.y) + sin(.1*time*position.x);
	
	gl_FragColor = vec4( vec3(position.x, position.y, 0.), 1.0 );

}