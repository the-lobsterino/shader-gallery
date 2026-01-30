#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 i = floor(gl_FragCoord.xy / 20.0);
	gl_FragColor = vec4(mod(i.x + i.y,1.0 + mouse.x));
}